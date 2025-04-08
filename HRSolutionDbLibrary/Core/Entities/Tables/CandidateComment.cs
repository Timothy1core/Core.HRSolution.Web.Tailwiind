namespace HRSolutionDbLibrary.Core.Entities.Tables;

public class CandidateComment
{
    public int Id { get; set; }

    public string Comment { get; set; }

    public DateTime CreatedDate { get; set; }

    public string CreatedBy { get; set; }

    public int CandidateId { get; set; }
    public virtual EmployeeInformation CreatedByInfo { get; set; }
    public virtual Candidate Candidate { get; set; }
}