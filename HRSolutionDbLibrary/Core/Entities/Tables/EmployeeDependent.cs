#nullable disable
using HRSolutionDbLibrary.Core.Entities.Tables;
public class EmployeeDependent
 {
	public string EmployeeId { get; set; }
	public string MemberCode { get; set; }
	public string FirstName { get; set; }
	public string LastName { get; set; }
	public DateTime? BirthDate { get; set; }
	public DateTime? Effectivity { get; set; }
	public virtual EmployeeInformation EmployeeInformation { get; set; }
}
