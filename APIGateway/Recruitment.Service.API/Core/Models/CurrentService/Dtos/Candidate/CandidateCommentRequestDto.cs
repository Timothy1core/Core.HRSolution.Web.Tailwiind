namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.Candidate;

public class CandidateCommentRequestDto
{

    public string Comment { get; set; }

    public DateTime CreatedDate { get; set; }

    public string CreatedBy { get; set; }

    public int CandidateId { get; set; }
}