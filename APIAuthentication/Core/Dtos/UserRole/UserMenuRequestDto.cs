#nullable disable
namespace APIAuthentication.Core.Dtos.UserRole
{
	public class UserMenuRequestDto
	{
		public int RoleId { get; set; }
		public string MenuName { get; set; }
		public string MenuPath { get; set; }
		public string MenuIcon { get; set; }
		public bool IsParent { get; set; }
		public bool IsSubParent { get; set; }
		public int SectionMenuId { get; set; }
		public int? ParentId { get; set; }
		public int OrderBy { get; set; }
	}
}
