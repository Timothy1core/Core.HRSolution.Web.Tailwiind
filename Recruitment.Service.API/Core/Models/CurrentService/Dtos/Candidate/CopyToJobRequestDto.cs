namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.Candidate;

public class CopyToJobRequestDto
{
    public int CandidateId { get; set; }
    public int JobId { get; set; }
    public int ApplicationStatusId { get; set; }
    public int SourceId { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string? CurrentSalary { get; set; }
    public string? ExpectedSalary { get; set; }
    public string? CurrentEmploymentStatus { get; set; }
    public string? NoticePeriod { get; set; }
    public string Resume { get; set; }
}