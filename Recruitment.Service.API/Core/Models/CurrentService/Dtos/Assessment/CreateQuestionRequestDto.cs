namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;

public class CreateQuestionRequestDto
{
    public int AssessmentId { get; set; }
    public string Body { get; set; }

    public int Type { get; set; }

    public bool Required { get; set; }
    public int Marks { get; set; }

    public virtual IList<AnswerRequestDto> Answers { get; set; }

    public virtual IList<ChoiceRequestDto> Choices { get; set; }
    public virtual IList<VideoDurationRequestDto> VideoDurations { get; set; }

}