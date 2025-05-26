namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;

public class QuestionAndAnswerDetailsDto
{
	public int QuestionId { get; set; }
	public string QuestionBody { get; set; }
	public string CorrectAnswerBody { get; set; }
	public string CandidateAnswerBody { get; set; }
	public bool? IsCorrect { get; set; }
}