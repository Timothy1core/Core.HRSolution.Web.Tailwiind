namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.Pipeline;

public class PipelineDto
{
    public string ProcessName { get; set; }
    public int ProcessCount { get; set; }
    public string? LeftNote { get; set; }
    public string? RightNote { get; set; }
}