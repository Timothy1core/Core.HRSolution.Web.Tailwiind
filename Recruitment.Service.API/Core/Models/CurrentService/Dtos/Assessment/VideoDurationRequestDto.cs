namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;

public class VideoDurationRequestDto
{
    public int Id { get; set; }

    public int QuestionId { get; set; }

    public int VideoDurationMinute { get; set; }
}