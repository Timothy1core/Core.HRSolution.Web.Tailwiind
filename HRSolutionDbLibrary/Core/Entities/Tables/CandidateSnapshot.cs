namespace HRSolutionDbLibrary.Core.Entities.Tables;

public class CandidateSnapshot
{
    public int Id { get; set; }

    public int CandidateId { get; set; }

    public string FilePath { get; set; }

    public virtual Candidate Candidate { get; set; }
}