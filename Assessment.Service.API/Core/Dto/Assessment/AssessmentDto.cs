using HRSolutionDbLibrary.Core.Entities.Tables;

namespace Assessment.Service.API.Core.Dto.NewFolder;

public class AssessmentDto
{
    public int Id { get; set; }

    public string Name { get; set; }

    public string Instruction { get; set; }

    public bool IsActive { get; set; }

    public int Duration { get; set; }

    public string? Description { get; set; }

    public virtual ICollection<JobAssessment> JobAssessments { get; set; } = new List<JobAssessment>();

    public virtual ICollection<AssessmentRemainingTimer> AssessmentRemainingTimers { get; set; } = new List<AssessmentRemainingTimer>();


    public virtual ICollection<AssessmentQuestion> Questions { get; set; } = new List<AssessmentQuestion>();
}