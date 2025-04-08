using HRSolutionDbLibrary.Core.Entities.Tables;

namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.Candidate;

public class AssessmentDetailsDto
{
    public int Id { get; set; }

    public string Name { get; set; }
    public virtual List<JobAssessmentDto> JobAssessments { get; set; } = new List<JobAssessmentDto>();

    public virtual ICollection<AssessmentCorrectionDto> AssessmentCorrections { get; set; } = new List<AssessmentCorrectionDto>();
}