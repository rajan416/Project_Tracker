using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ProjectTracker.Api.Models
{
    /// <summary>
    /// Represents a project within the tracking system.  Data annotations enforce
    /// validation rules such as required fields and string lengths.  A custom
    /// validation via <see cref="IValidatableObject"/> ensures that the end date is
    /// not earlier than the start date.
    /// </summary>
    public class Project : IValidatableObject
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Project name is required.")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Project name must be between 3 and 100 characters.")]
        public string Name { get; set; } = string.Empty;

        [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters.")]
        public string? Description { get; set; }
        [Required(ErrorMessage = "Owner is required.")]
        [StringLength(100, ErrorMessage = "Owner cannot exceed 100 characters.")]
        public string Owner { get; set; } = string.Empty;

        [Required]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public ProjectStatus Status { get; set; }
        
        [DataType(DataType.Date)]
        public DateTime StartDate { get; set; }

        [DataType(DataType.Date)]
        public DateTime EndDate { get; set; }

        /// <summary>
        /// Validates that the end date is not earlier than the start date.
        /// </summary>
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (EndDate < StartDate)
            {
                yield return new ValidationResult(
                    "End date must be greater than or equal to start date.",
                    new[] { nameof(EndDate), nameof(StartDate) });
            }
        }
    }
}