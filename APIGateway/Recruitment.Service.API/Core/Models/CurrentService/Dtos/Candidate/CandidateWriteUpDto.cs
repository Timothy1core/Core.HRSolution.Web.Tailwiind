namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.Candidate;

public class CandidateWriteUpDto
{
    public int Id { get; set; }
    public int CandidateId { get; set; }
    public string ProfileOverview { get; set; }

    public string ProfessionalBackground { get; set; }

    public string Skills { get; set; }

    public string Behavioral { get; set; }

    public string Notes { get; set; }

}