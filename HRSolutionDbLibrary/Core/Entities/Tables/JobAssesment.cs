#nullable disable
namespace HRSolutionDbLibrary.Core.Entities.Tables;

public class JobAssessment
{
    public int Id { get; set; }

    public int JobId { get; set; }

    public int? AssessmentId { get; set; }
    public bool IsActive { get; set; }

    public string CreatedBy { get; set; }

    public DateTime CreatedDate { get; set; }

    public virtual Assessment Assessment { get; set; }

    public virtual JobProfile Job { get; set; }
}