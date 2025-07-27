using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectTracker.Api.Data;
using ProjectTracker.Api.Models;

namespace ProjectTracker.Api.Controllers
{
    /// <summary>
    /// Exposes RESTful endpoints for managing projects.  Supports listing,
    /// filtering, retrieval by id, creation, update and deletion.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProjectsController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Returns all projects.  An optional status query parameter filters the results.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Project>>> GetProjects([FromQuery] ProjectStatus? status)
        {
            IQueryable<Project> query = _context.Projects;
            if (status.HasValue)
            {
                query = query.Where(p => p.Status == status.Value);
            }
            var projects = await query.ToListAsync();
            return Ok(projects);
        }

        /// <summary>
        /// Returns a single project by its identifier.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<Project>> GetProject(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            return project == null ? NotFound() : Ok(project);
        }

        /// <summary>
        /// Creates a new project.  The project information must pass model validation.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<Project>> CreateProject(Project project)
        {
            // Model validation is automatically handled by ApiController attribute.
            _context.Projects.Add(project);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
        }

        /// <summary>
        /// Updates an existing project.  The id in the route must match the id in the request body.
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, Project updatedProject)
        {
            if (id != updatedProject.Id)
            {
                return BadRequest("Route id and project id must match.");
            }
            // Mark the entity as modified.  In a more complex application a service layer would handle mapping.
            _context.Entry(updatedProject).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProjectExists(id))
                {
                    return NotFound();
                }
                throw;
            }
            return NoContent();
        }

        /// <summary>
        /// Deletes a project by its identifier.
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }
            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool ProjectExists(int id) => _context.Projects.Any(p => p.Id == id);
    }
}