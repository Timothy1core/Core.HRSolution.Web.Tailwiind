#nullable disable
namespace HRApplicationDbLibrary.Core.Entities.Tables;

public class UserApiPermission
{
	public int Id { get; set; }

	public int RoleId { get; set; }

	public bool IsActive { get; set; }

	public int ApiId { get; set; }

	public virtual Api Api { get; set; }

	public virtual UserRole Role { get; set; }
}