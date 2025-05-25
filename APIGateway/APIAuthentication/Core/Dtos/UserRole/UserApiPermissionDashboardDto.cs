namespace APIAuthentication.Core.Dtos.UserRole
{
	public class UserApiPermissionDashboardDto
	{
		public int Id { get; set; }

		public string Role { get; set; }

		public bool IsActive { get; set; }

		public string PermissionName { get; set; }
	}
}
