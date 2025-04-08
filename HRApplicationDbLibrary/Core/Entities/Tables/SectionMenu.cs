#nullable disable
namespace HRApplicationDbLibrary.Core.Entities.Tables
{
	public class SectionMenu
	{
		public int Id { get; set; }
		public string SectionName { get; set; }
		public bool IsActive { get; set; }
		public DateTime CreatedDate { get; set; }
		public string CreatedBy { get; set; }
		public int OrderBy { get; set; }
		public virtual ICollection<UserMenuAccess> UserMenuAccesses { get; set; } = new List<UserMenuAccess>();
	}
}
