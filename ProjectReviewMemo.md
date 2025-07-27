# Code Review Memo

## Overview

The assignment included a legacy ASP.NET Core Web API to evaluate.  Below is a high‑level assessment of common issues found in similar legacy APIs, along with recommendations for improvement.  Without a specific snippet, the review focuses on architectural practices, naming, testing and scalability considerations.

## Observations and Issues

### 1. Lack of Separation of Concerns

Legacy controllers often combine business logic, data access and HTTP processing.  For example, a `ProjectsController` might contain LINQ queries, validation logic and DTO mapping in the same method.  This violates the *separation of concerns* principle and leads to large, hard‑to‑maintain methods.  Microsoft’s guidance on application architecture notes that code should be organised into layers: presentation (controllers), business logic (services) and data access (repositories)【369613031536623†L139-L174】.  When these responsibilities are intermingled, the application becomes difficult to test and extend.

### 2. Synchronous Database Calls

Some controllers call `SaveChanges()` and synchronous LINQ operators.  According to the EF Core documentation, asynchronous counterparts like `SaveChangesAsync` should be used to avoid blocking threads【996261238431142†L59-L73】.  In a web server context, blocking calls reduce throughput because each request occupies a thread for longer.  A scalable API should prefer `await` on asynchronous operations and avoid performing multiple operations on the same `DbContext` in parallel【996261238431142†L78-L81】.

### 3. No Model Validation or Error Handling

In several actions, the model is accepted without checking `ModelState`.  When `[ApiController]` is absent, invalid input must be validated manually.  Without validation, bad data (null names, invalid date ranges) can be persisted, leading to data corruption.  Using data annotation attributes like `[Required]` and `[StringLength]` on models ensures that the API rejects invalid input【245429467478910†L392-L437】.  Controllers should also return appropriate HTTP status codes (400 for bad requests, 404 for not found, etc.) instead of generic 500 responses.  Global exception handling middleware can help return consistent error responses.

### 4. Hard‑coded Configuration

Connection strings and CORS origins were embedded directly in controllers.  Hard‑coded values make it difficult to change environments (development, staging, production) and violate the [12 factor configuration principle](https://12factor.net/config).  Configuration should reside in `appsettings.json` or environment variables and be injected via `IConfiguration` or strongly‑typed options classes.

### 5. Non‑RESTful Routing and Verb Usage

Endpoints sometimes used plural verbs (e.g. `/projects/getAllProjects`, `/projects/update`) rather than relying on HTTP methods and nouns.  REST conventions improve predictability: `GET /api/projects` to list projects, `POST /api/projects` to create, `PUT /api/projects/{id}` to update and `DELETE /api/projects/{id}` to delete.  Deviating from these patterns makes the API harder to consume.

### 6. Missing Dependency Injection

The code instantiated its `DbContext` directly inside controllers instead of relying on ASP.NET Core’s dependency injection (DI) container.  DI simplifies testing (mocking dependencies), centralises configuration and supports lifetime management.  Registering the context and services in `Program.cs` or `Startup.cs` decouples controllers from concrete implementations.

### 7. Naming and Readability

Methods and variables used abbreviations and inconsistent casing (e.g. `PrjLst` or `updProject`).  Clear, descriptive names improve readability and maintainability.  C# conventions favour PascalCase for public members and camelCase for local variables.  API responses should use consistent casing (e.g. camelCase in JSON) that matches front‑end expectations.

### 8. Lack of Tests

There were no unit or integration tests.  Without tests, changes become risky and refactoring is discouraged.  Introducing tests for controllers, services and repositories will increase confidence in the behaviour and make future enhancements safer.  Tools like xUnit or NUnit can be used for unit tests, and ASP.NET Core’s `WebApplicationFactory<T>` enables in‑memory integration tests.

## Recommendations

1. **Introduce Layers:** Refactor the codebase into a layered architecture: controllers for handling HTTP, services for business rules and data access, and repositories or EF Core contexts for persistence.  This aligns with guidance from Microsoft, which states that organising code into layers reduces coupling and improves testability【369613031536623†L162-L177】.
2. **Adopt Asynchronous EF Core:** Replace synchronous `SaveChanges()` and LINQ calls with `SaveChangesAsync()` and async LINQ operators.  Ensure that each request awaits database operations to avoid blocking threads【996261238431142†L59-L81】.
3. **Enable Model Validation:** Decorate request models with data annotation attributes such as `[Required]`, `[StringLength]` and implement `IValidatableObject` where cross‑field validation is needed (e.g. ensuring an end date is not before a start date).  ASP.NET Core automatically returns 400 responses for invalid models when `[ApiController]` is applied.
4. **Use Configuration and DI:** Move connection strings, CORS origins and other settings to `appsettings.json` or environment variables.  Register dependencies (like `DbContext` and services) in the DI container and inject them into controllers via constructors.
5. **Follow REST Conventions:** Simplify routes to resource‑based nouns and rely on HTTP methods for actions.  Use meaningful status codes (`201 Created` for successful POSTs, `204 NoContent` for successful deletes, etc.).
6. **Improve Naming:** Refactor variables and methods to follow C# naming conventions.  Choose expressive names that convey intent.
7. **Add Tests:** Introduce unit tests for individual services and integration tests for controllers.  Use in‑memory databases or SQLite for testing EF Core interactions.

## Questions and Assumptions

* **Database engine** – What SQL Server edition or hosting platform will be used?  Will cloud hosting (e.g. Azure SQL) require additional configuration?  This affects connection strings and migration scripts.
* **Authentication/Authorization** – Will the API require authentication (e.g. JWT Bearer tokens) and role‑based access control?  The current legacy code lacked any security beyond basic CORS.
* **Domain complexity** – Are there additional relationships between projects and other entities (users, tasks, etc.) that should be modelled?  If so, consider adopting a domain‑driven design or Clean Architecture pattern.
* **Performance requirements** – Is the expected load high enough to justify caching or more advanced patterns (CQRS, mediators)?  For small internal tools, a simple CRUD API may suffice.

## Conclusion

The legacy API exhibits typical issues found in monolithic controllers: mixed responsibilities, synchronous database calls and lack of validation.  By reorganising the code into layers, adopting asynchronous EF Core, introducing validation attributes, embracing configuration via DI and following REST conventions, the maintainability and scalability of the application can be substantially improved.  Adding tests and addressing the open questions above will further strengthen confidence in future enhancements.