using HRSolutionDbLibrary.Core.Entities.Tables;

namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.Candidate;

public class CandidateDto
{
    public int Id { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }

    public string Email { get; set; }

    public string PhoneNumber { get; set; }

    public string Resume { get; set; }

    public int SourceId { get; set; }

    public int JobId { get; set; }
    public int ClientId { get; set; }
    public string JobName { get; set; }

    public string CurrentEmploymentStatus { get; set; }

    public string NoticePeriod { get; set; }

    public string CurrentSalary { get; set; }

    public string ExpectedSalary { get; set; }

    public int ApplicationStatusId { get; set; }

    public bool IsDisqualified { get; set; }
    public bool IsActive { get; set; }

    public virtual ICollection<CandidateWriteUp>? CandidateWriteUps { get; set; } = new List<CandidateWriteUp>();
    public virtual global::JobProfile Job { get; set; } = new global::JobProfile();

    public virtual ICollection<JobApplicationAnswer> JobApplicationAnswers { get; set; } = new List<JobApplicationAnswer>();

    public virtual Source? Source { get; set; }

    public virtual ICollection<AssessmentAnswer>? AssessmentAnswers { get; set; } = new List<AssessmentAnswer>();

    public virtual ICollection<AssessmentRemainingTimer>? AssessmentRemainingTimers { get; set; } = new List<AssessmentRemainingTimer>();
    public virtual CandidateCredential? CandidateCredentials { get; set; }
    public virtual ICollection<CandidateSnapshot>? CandidateSnapshots { get; set; } = new List<CandidateSnapshot>();
    public string? StageName { get; set; }
    public string? SourceName { get; set; }
    public int ClientCompanyId { get; set; }
    public int ClientGroupId { get; set; }
    public int? JobOfferStatusId { get; set; }
}