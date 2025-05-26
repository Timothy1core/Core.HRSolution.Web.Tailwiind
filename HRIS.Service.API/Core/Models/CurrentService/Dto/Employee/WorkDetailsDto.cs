
namespace HRIS.Service.API.Core.Models.CurrentService.Dto.Employee
{
	public class WorkDetailsDto
	{
		public DateTime DateHired { get; set; }
		public DateTime RegularizationDate { get; set; }
		public string EmploymentStatus { get; set; }
		public string ContractType { get; set; }
		public string Position { get; set; }
		public string ImmediateSuperior { get; set; }
		public string EmployeeLevel { get; set; }
		public string CompanyEmail { get; set; }
		public string DepartmentGroup { get; set; }
		public int Department { get; set; }
		public int? TeamId { get; set; }
		public int? LocationId { get; set; }
		public string Sss { get; set; }
		public string Philhealth { get; set; }
		public string Tin { get; set; }
		public string Pagibig { get; set; }
		public string Bank { get; set; }
		public string BankBranch { get; set; }
		public string BankAccount { get; set; }
		public int? ScheduleTypeId { get; set; }
		public decimal? WorkHours { get; set; }
		public string WorkSetup { get; set; }
		public bool HasPerfectAttendance { get; set; }
		public DateTime? SeparationDate { get; set; }
		public DateTime? ClearedDate { get; set; }
		public DateTime? LastPayReleaseDate { get; set; }
		public string Remarks { get; set; }
		public string ReasonForLeaving { get; set; }
		public bool? IsActive { get; set; }
	}
}
