namespace ProjectTracker.Api.Models
{
    /// <summary>
    /// Defines the possible life‑cycle states of a project.  These string values are serialised
    /// to and from JSON when interacting with the API.
    /// </summary>
    public enum ProjectStatus
    {
        Planned,
        InProgress,
        Completed
    }
}