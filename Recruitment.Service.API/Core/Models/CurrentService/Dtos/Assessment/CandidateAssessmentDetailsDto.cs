using HRSolutionDbLibrary.Core.Entities.Tables;
using Recruitment.Service.API.Persistence.Repositories.CurrentService.Tables;

namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;

public class CandidateAssessmentDetailsDto
{
	public int Id { get; set; }
	public string AssessmentName { get; set; }
	public virtual ICollection<QuestionAndAnswerDetailsDto> Questions { get; set; } = new List<QuestionAndAnswerDetailsDto>();
}