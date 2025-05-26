#nullable disable
namespace HRSolutionDbLibrary.Core.Entities.hris.Tables;

public class EmployeeDocument
{
	public int Id { get; set; }
	public string EmployeeId { get; set; }

	public string FileName { get; set; }

	public string DocumentType { get; set; }
	public DateTime? DateSubmitted { get; set; }
	public int? DocumentGroup { get; set; }
	public virtual EmployeeInformation EmployeeInformation { get; set; }
}