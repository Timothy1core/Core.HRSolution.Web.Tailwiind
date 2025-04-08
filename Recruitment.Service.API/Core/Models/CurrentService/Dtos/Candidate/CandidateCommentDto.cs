namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.Candidate;

public class CandidateCommentDto
{

    public string Comment { get; set; }

    public DateTime CreatedDate { get; set; }

    public string CreatedBy { get; set; }

    public int CandidateId { get; set; }
    public string CreatedByName { get; set; }
}