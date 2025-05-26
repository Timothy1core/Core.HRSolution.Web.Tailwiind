#nullable disable
using HRSolutionDbLibrary.Core.Entities.Tables;
public class EmployeeMilestone
{
	public string EmployeeId { get; set; }
	public string Description { get; set; }
	public DateTime? Date { get; set; }
	public virtual EmployeeInformation EmployeeInformation { get; set; }
}
