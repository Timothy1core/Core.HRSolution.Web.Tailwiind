namespace APIAuthentication.Core.Dtos.UserRole
{
	public class UserRoleDashboardDto
	{
		public int Id { get; set; }

		public string Role { get; set; }

		public bool IsActive { get; set; }

		public DateTime CreatedDate { get; set; }

		public string CreatedBy { get; set; }
	}
}
