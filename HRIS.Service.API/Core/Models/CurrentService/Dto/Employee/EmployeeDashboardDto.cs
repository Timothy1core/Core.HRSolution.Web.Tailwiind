
namespace HRIS.Service.API.Core.Models.CurrentService.Dto.Employee
{
	public class EmployeeDashboardDto
	{
		public string EmployeeId { get; set; }
		public string EmployeeName { get; set; }
		public DateTime DateHired { get; set; }
		public DateTime RegularizationDate { get; set; }
		public string Status { get; set; }
		public string Group { get; set; }
		public string Department { get; set; }
		public string Position { get; set; }
	}
}
