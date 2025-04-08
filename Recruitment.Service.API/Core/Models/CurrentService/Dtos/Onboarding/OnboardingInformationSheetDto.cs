namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.Onboarding;

public class OnboardingInformationSheetDto
{
	public int CandidateId { get; set; }

	public string FirstName { get; set; }

	public string LastName { get; set; }

	public string? MiddleName { get; set; }

	public string? MiddleNamePrefix { get; set; }

	public string? Suffix { get; set; }

	public string Salutation { get; set; }

	public string Gender { get; set; }

	public string CivilStatus { get; set; }

	public DateTime DateOfBirth { get; set; }

	public string CurrentAddress { get; set; }

	public string CurrentLocation { get; set; }

	public string CurrentCityProvince { get; set; }

	public string CurrentZipcode { get; set; }

	public string PermanentAddress { get; set; }

	public string PermanentLocation { get; set; }

	public string PermanentCityProvince { get; set; }

	public string PermanentZipcode { get; set; }

	public string EducationalAttainment { get; set; }

	public string? LandlineNo { get; set; }

	public string MobileNo { get; set; }

	public string? AlternativeMobileNo { get; set; }

	public string PersonalEmail { get; set; }

	public string EmergencyContactPerson { get; set; }

	public string EmergencyContactNo { get; set; }

	public string EmergencyRelation { get; set; }

	public string SssidNo { get; set; }

	public string TinidNo { get; set; }

	public string PhilhealthIdNo { get; set; }

	public string PagibigIdNo { get; set; }
	public int? CurrentStep { get; internal set; }
	public bool? IsAcknowledged { get; internal set; }
	public string CandidateName { get; internal set; }
	public string Position { get; internal set; }
}