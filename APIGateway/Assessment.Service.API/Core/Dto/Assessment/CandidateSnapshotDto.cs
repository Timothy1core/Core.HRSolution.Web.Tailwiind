namespace Assessment.Service.API.Core.Dto.Assessment;

public class CandidateSnapshotDto
{
    public int CandidateId { get; set; }

    public IFormFile? SnapshotFile { get; set; }

}