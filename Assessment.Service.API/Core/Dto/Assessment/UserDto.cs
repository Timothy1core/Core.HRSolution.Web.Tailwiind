namespace Assessment.Service.API.Core.Dto.Assessment;

public class UserDto
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }

    public string JobName { get; set; }
    public virtual ICollection<CandidateCredentialDto> CandidateCredentials { get; set; } = new List<CandidateCredentialDto>();
    public virtual ICollection<HRSolutionDbLibrary.Core.Entities.Tables.Assessment> Assessments { get; set; } = new List<HRSolutionDbLibrary.Core.Entities.Tables.Assessment>();
    public string FullName => FirstName + " " + LastName;
    public string CandidateId => Id.ToString();

}