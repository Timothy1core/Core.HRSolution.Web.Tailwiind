#nullable disable
namespace HRSolutionDbLibrary.Core.Entities.Tables;

public class AssessmentRemainingTimer
{
    public int Id { get; set; }

    public int RemainingTime { get; set; }

    public int AssessmentId { get; set; }

    public int CandidateId { get; set; }

    public virtual Assessment Assessment { get; set; }

    public virtual Candidate Candidate { get; set; }
    public virtual ICollection<CandidateCredential> CandidateCredentials { get; set; } = new List<CandidateCredential>();
}