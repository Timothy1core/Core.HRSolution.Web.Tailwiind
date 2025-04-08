namespace APIAuthentication.Core.Dtos.Authentication
{
	public class MenuDto
	{
		public int MenuId { get; set; }
		public string MenuName { get; set; }
		public string MenuPath { get; set; }
		public string Icon { get; set; }
		public bool IsParent { get; set; }
		public bool IsSubParent { get; set; }
		public int? ParentId { get; set; }
		public List<MenuDto> SubMenus { get; set; } = new List<MenuDto>();

	}
}
