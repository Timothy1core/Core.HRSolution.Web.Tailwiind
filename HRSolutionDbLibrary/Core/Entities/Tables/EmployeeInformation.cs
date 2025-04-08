namespace HRSolutionDbLibrary.Core.Entities.Tables;

public class EmployeeInformation
{
	public bool? IsActive { get; set; }

	public string EmployeeId { get; set; }

	public int? OnboardingId { get; set; }

	public string YearId { get; set; }

	public string FirstName { get; set; }

	public string LastName { get; set; }

	public string MiddleName { get; set; }

	public string MiddleNamePrefix { get; set; }

	public string Suffix { get; set; }

	public string Salutation { get; set; }

	public string Gender { get; set; }

	public string CivilStatus { get; set; }

	public DateTime DateOfBirth { get; set; }

	public string EducationalAttainment { get; set; }

	public string CurrentAddress { get; set; }

	public string CurrentLocation { get; set; }

	public string CurrentCityProvince { get; set; }

	public string CurrentZipcode { get; set; }

	public string PermanentAddress { get; set; }

	public string PermanentLocation { get; set; }

	public string PermanentCityProvince { get; set; }

	public string PermanentZipcode { get; set; }

	public string LandlineNo { get; set; }

	public string MobileNo { get; set; }

	public string AlternativeMobileNo { get; set; }

	public string PersonalEmail { get; set; }

	public string EmergencyContactPerson { get; set; }

	public string EmergencyContactNo { get; set; }

	public string EmergencyRelation { get; set; }

	public DateTime DateHired { get; set; }

	public DateTime RegularizationDate { get; set; }

	public string EmploymentStatus { get; set; }

	public string ContractType { get; set; }

	public string Position { get; set; }

	public int DepartmentId { get; set; }

	public string ImmediateSuperior { get; set; }

	public string EmployeeLevel { get; set; }

	public string CompanyEmail { get; set; }

	public string LeaveBenefitType { get; set; }

	public string Sss { get; set; }

	public string Tin { get; set; }

	public string Philhealth { get; set; }

	public string Pagibig { get; set; }

	public string Bank { get; set; }

	public string BankBranch { get; set; }

	public string BankAccount { get; set; }

	public decimal? WorkHours { get; set; }

	public string WorkSetup { get; set; }

	public int? ScheduleTypeId { get; set; }

	public bool HasPerfectAttendance { get; set; }

	public string BasicPay { get; set; }

	public string MealAllowance { get; set; }

	public string RiceAllowance { get; set; }

	public string ClothingAllowance { get; set; }

	public string LaundryAllowance { get; set; }

	public string MedicalCashAllowance { get; set; }

	public string TaxableAllowance { get; set; }

	public string Deminimis { get; set; }

	public DateTime? SeparationDate { get; set; }

	public DateTime? ClearedDate { get; set; }

	public DateTime? LastPayReleaseDate { get; set; }

	public string Remarks { get; set; }

	public string ReasonForLeaving { get; set; }

	public int? TeamId { get; set; }

	public int? LocationId { get; set; }
}