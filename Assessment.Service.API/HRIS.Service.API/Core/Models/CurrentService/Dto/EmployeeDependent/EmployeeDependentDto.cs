
namespace HRIS.Service.API.Core.Models.CurrentService.Dto.EmployeeDependent
{
	public class EmployeeDependentDto
	{
		public string MemberCode { get; internal set; }
		public string FirstName { get; internal set; }
		public string LastName { get; internal set; }
		public DateTime? BirthDate { get; internal set; }
		public DateTime? Effectivity { get; internal set; }
	}
}
