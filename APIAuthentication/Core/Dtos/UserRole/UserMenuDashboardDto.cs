namespace APIAuthentication.Core.Dtos.UserRole
{
	public class UserMenuDashboardDto
	{
		public int Id { get; set; }

		public string Role { get; set; }

		public string MenuName { get; set; }

		public string MenuPath { get; set; }

		public string MenuIcon { get; set; }

		public bool IsActive { get; set; }

		public bool IsParent { get; set; }

		public bool IsSubParent { get; set; }

		public string SectionMenu { get; set; }
		public int? ParentId { get; set; }
		public int OrderBy { get; set; }
		public bool IsHidden { get; set; }
	}
}
