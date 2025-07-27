# Project Tracker

This repository contains a lightweight internal project‑tracking tool built as part of a take‑home assignment.  The solution comprises a back‑end **ASP.NET Core Web API** and a front‑end **React** application.  The API exposes endpoints to create, read, update and delete projects, while the React UI allows users to add new projects, view them in a searchable table and filter by status.

## Prerequisites

* **.NET 8 SDK** – required to build and run the Web API.  You can download it from [dotnet.microsoft.com](https://dotnet.microsoft.com/download).
* **SQL Server** or **SQL Server LocalDB** – used for data storage.  The default connection string targets LocalDB, but you can update it for a full SQL Server instance.
* **Node .js** and **npm** – required to run the React application.

## Getting Started

### Clone the repository

```bash
git clone <repository‑url>
cd ProjectTracker
```

### Configure the database

1. Open `ProjectTracker.Api/appsettings.json` and adjust the `DefaultConnection` string if necessary.  The default connection uses LocalDB:

   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=ProjectTrackerDb;Trusted_Connection=True;MultipleActiveResultSets=true"
   }
   ```

2. (Optional) To quickly create the projects table without Entity Framework migrations, run the SQL script in `ProjectTracker.Api/Database/CreateProjects.sql` against your database.  Alternatively, you can use Entity Framework migrations:

   ```bash
   dotnet tool install --global dotnet‑ef
   cd ProjectTracker.Api
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```

### Run the API

1. Navigate to the API project:

   ```bash
   cd ProjectTracker.Api
   dotnet restore
   dotnet run
   ```

2. The API will start on `https://localhost:5001` (or another port if configured).  Swagger UI is available at `/swagger` in development mode.  CORS is configured to allow requests from `http://localhost:3000`.  Update the `AllowedOrigins` setting in `appsettings.json` if you host the front‑end elsewhere.

### Run the React client

1. Open a new terminal and navigate to the client directory:

   ```bash
   cd ProjectTracker.Client
   npm install
   npm start
   ```

2. The React app runs on `http://localhost:3000` by default.  It communicates with the API via Axios using the `/api/projects` endpoints.  You can configure the base API URL through the `REACT_APP_API_URL` environment variable.

## Assumptions and Decisions

* **React over Angular** – the front‑end is implemented using React because it offers a lightweight setup and a large ecosystem of UI components.  For an assignment of this size, React provides quicker ramp‑up time and simpler state management compared to a full Angular setup.
* **Layered architecture** – the API separates responsibilities into models, data access and controllers.  Organising code into layers improves maintainability and follows the *separation of concerns* principle.  Microsoft’s architecture guidance notes that folders for Models, Controllers and Data should hold their respective responsibilities and that keeping business logic in services avoids spaghetti code【369613031536623†L139-L156】.  The solution therefore places the `Project` entity in a **Models** folder, the EF Core context in **Data**, and the controller in **Controllers**.
* **Model validation** – validation rules are enforced via data annotations.  Attributes such as `[Required]` ensure that properties are not null【245429467478910†L392-L412】, while `[StringLength]` restricts the length of text fields【245429467478910†L414-L437】.  A custom validation implemented through `IValidatableObject` ensures that the project end date is not earlier than the start date.  Because the API uses the `[ApiController]` attribute, invalid models automatically generate a 400 response.
* **Asynchronous EF Core** – all database operations are asynchronous.  EF Core provides asynchronous counterparts to its synchronous methods to avoid blocking threads; using `SaveChangesAsync` frees up the web server to handle other requests【996261238431142†L59-L73】.  This improves scalability of the API.
* **JSON enum conversion** – the API serialises and deserialises `ProjectStatus` values as strings.  This makes the API easier to consume from JavaScript clients.  The JSON converter is configured in `Program.cs`.
* **CORS** – Cross‑origin resource sharing is configured to allow requests from the React development server.  Add or remove origins in `appsettings.json` to suit your deployment.

## API Overview

The API exposes the following RESTful endpoints under the `/api/projects` route:

| Method | Endpoint              | Description                          |
|-------:|-----------------------|--------------------------------------|
|  `GET` | `/api/projects`       | Retrieves all projects (optional `status` query parameter filters by status). |
|  `GET` | `/api/projects/{id}`  | Retrieves a single project by its identifier. |
| `POST` | `/api/projects`       | Creates a new project.  Validates required fields and date ranges. |
|  `PUT` | `/api/projects/{id}`  | Updates an existing project.  The `id` in the URL must match the request body. |
| `DELETE`| `/api/projects/{id}` | Deletes a project by its identifier. |

You can interact with these endpoints using Swagger UI at `https://localhost:5001/swagger` when running the API in development mode.

## UI Features

* **Create project form** – a form allows users to enter project details: name, description, owner, status (`Planned`, `InProgress` or `Completed`) and start/end dates.  The UI performs basic required validation and submits to the API.  After creation, the list is refreshed.
* **Projects table** – displays all projects in a tabular view.  Users can filter by status using the drop‑down.  Each row shows project details and includes actions to delete or (via a simple prompt) update the status.  Editing other fields could be added with a modal dialog.
* **Material‑UI components** – the UI uses Material‑UI for a clean, responsive design.  The table adapts to smaller screens via horizontal scrolling.

## Database Schema

The schema can be created manually with the following SQL script (`Database/CreateProjects.sql`):

```sql
CREATE TABLE [dbo].[Projects] (
    [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [Name] NVARCHAR(100) NOT NULL,
    [Description] NVARCHAR(1000) NULL,
    [Owner] NVARCHAR(100) NOT NULL,
    [Status] INT NOT NULL,
    [StartDate] DATE NOT NULL,
    [EndDate] DATE NOT NULL
);
```

Entity Framework migrations can generate this table automatically, but the script is provided for convenience.

## Tech stack and trade‑offs

The back‑end targets **.NET 8** and uses **ASP.NET Core Web API** with **Entity Framework Core** for data access.  EF Core simplifies CRUD operations and provides a rich set of validation attributes.  For a small application, EF Core is appropriate and avoids the overhead of micro‑ORMs or hand‑written SQL.  However, for larger systems or when fine‑tuned queries are required, more granular control or stored procedures might be preferable.

The front‑end uses **React** and **Material‑UI**.  React offers a gentle learning curve and a large ecosystem, allowing quick prototyping.  Material‑UI provides pre‑styled components, which reduces the amount of custom CSS required.  For more complex forms or state management across many components, additional libraries such as Redux or React Query might be considered, but they were unnecessary for this assignment.

## How validation and API structure were approached

Validation rules are implemented in the `Project` model using data annotations.  Because the API is annotated with `[ApiController]`, invalid models automatically return a 400 Bad Request with detailed error information.  The `IValidatableObject` interface is used to enforce the business rule that the end date cannot precede the start date.  The API follows REST conventions, uses meaningful HTTP status codes and resource‑based routing, and returns `CreatedAtAction` responses for POST requests.  CORS is set up to allow front‑end requests, and Swagger is enabled for interactive API documentation.
