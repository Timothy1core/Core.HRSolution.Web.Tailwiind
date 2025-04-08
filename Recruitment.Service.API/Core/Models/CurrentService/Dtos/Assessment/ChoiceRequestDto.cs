namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;

public class ChoiceRequestDto
{
    public int Id { get; set; }
    public int QuestionId { get; set; }
    public string ChoiceBody { get; set; }

}