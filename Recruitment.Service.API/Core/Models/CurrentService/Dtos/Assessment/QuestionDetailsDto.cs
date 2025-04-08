using HRSolutionDbLibrary.Core.Entities.Tables;

namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;

public class QuestionDetailsDto
{
    public int Id { get; set; }
    public string Body { get; set; }
    public string? Answer { get; set; }
    public int Type { get; set; }
    public bool? Correction { get; set; }
    public int AnswerId { get; set; }

    public int CorrectionId { get; set; }
}