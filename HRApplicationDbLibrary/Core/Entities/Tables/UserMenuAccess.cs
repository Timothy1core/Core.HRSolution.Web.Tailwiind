#nullable disable
namespace HRApplicationDbLibrary.Core.Entities.Tables;

public class UserMenuAccess
{
	public int Id { get; set; }

	public int RoleId { get; set; }

	public string MenuName { get; set; }

	public string MenuPath { get; set; }

	public string MenuIcon { get; set; }

	public bool IsActive { get; set; }
	public bool IsHidden { get; set; }
	public bool IsParent { get; set; }

	public bool IsSubParent { get; set; }
	
	public DateTime CreatedDate { get; set; }

	public string CreatedBy { get; set; }
	public int SectionMenuId { get; set; }
	public int? ParentId { get; set; }
	public int OrderBy { get; set; }
	public virtual UserRole Role { get; set; }
	public virtual SectionMenu SectionMenu { get; set; }

}