namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;

public class AnswerRequestDto
{
    public int Id { get; set; }
    public int QuestionId { get; set; }
    public string AnswerBody { get; set; }
}