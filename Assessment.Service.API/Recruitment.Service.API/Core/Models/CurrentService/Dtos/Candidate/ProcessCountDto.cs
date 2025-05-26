using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Candidate;

public class ProcessCountDto
{
    public int ApplicationProcessId { get; set; }
    public string ProcessName { get; set; }
    public int CandidateCount { get; set; }
}