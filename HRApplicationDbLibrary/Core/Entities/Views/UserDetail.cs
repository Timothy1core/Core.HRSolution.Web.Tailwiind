#nullable disable

namespace HRApplicationDbLibrary.Core.Entities.Views
{
	public class UserDetail
	{
		public bool IsActive { get; set; }

		public string YearId { get; set; }

		public string EmployeeId { get; set; }

		public string FirstName { get; set; }

		public string LastName { get; set; }

		public string MiddleNamePrefix { get; set; }

		public string Gender { get; set; }

		public string Salutation { get; set; }

		public DateTime DateHired { get; set; }

		public string EmploymentStatus { get; set; }

		public string CompanyEmail { get; set; }
	}
}
