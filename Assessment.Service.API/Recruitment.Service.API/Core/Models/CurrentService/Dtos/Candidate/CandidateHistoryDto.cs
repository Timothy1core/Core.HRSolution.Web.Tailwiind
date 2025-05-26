namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.Candidate;

public class CandidateHistoryDto
{
    public int Id { get; set; }

    public string Name { get; set; }

    public string Type { get; set; }

    public string Description { get; set; }

	public DateTime CreatedDate { get; set; }

    public string? CreatedBy { get; set; }
    public int CandidateId { get; set; }
    public string CreatedByName { get; set; }
}