namespace HRSolutionDbLibrary.Core.Entities.Tables;

public class CandidateHistory
{
    public int Id { get; set; }

    public string Name { get; set; }

    public string Type { get; set; }

    public string Description { get; set; }

    public DateTime CreatedDate { get; set; }

    public string CreatedBy { get; set; }
    public int CandidateId { get; set; }

    //public virtual EmployeeInformation? CreatedByInfo { get; set; }
    public virtual Candidate Candidate { get; set; }
}