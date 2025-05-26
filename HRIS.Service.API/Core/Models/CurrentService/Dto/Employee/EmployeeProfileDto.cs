
namespace HRIS.Service.API.Core.Models.CurrentService.Dto.Employee
{
	public class EmployeeProfileDto
	{
		public string EmployeeName { get; set; }
		public string Position { get; set; }
		public string EmployeeId { get; set; }
		public string DepartmentName { get; set; }
		public DateTime DateHired { get; set; }
		public DateTime RegularizationDate { get; set; }
		public string EmploymentStatus { get; set; }
	}
}
