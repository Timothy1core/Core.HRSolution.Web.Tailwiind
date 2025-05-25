namespace APIAuthentication.Core.Dtos.Authentication
{
	public class UserDto
	{
		public string EmoloyeeId { get; set; }
		public string YearHired { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public string EmailAddress { get; set; }
		public string Gender { get; set; }

		public string FullName => FirstName + " " + LastName;
		public string EmployeeNumber => YearHired + "-" + EmoloyeeId;
	}
}
