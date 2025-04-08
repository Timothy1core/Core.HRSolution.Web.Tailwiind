#nullable disable
namespace HRApplicationDbLibrary.Core.Entities.Tables;

public  class UserRole
{
	public int Id { get; set; }

	public string Role { get; set; }

	public bool IsActive { get; set; }

	public DateTime CreatedDate { get; set; }

	public string CreatedBy { get; set; }

	public virtual ICollection<UserApiPermission> UserApiPermissions { get; set; } = new List<UserApiPermission>();

	public virtual ICollection<UserCredential> UserCredentials { get; set; } = new List<UserCredential>();

	public virtual ICollection<UserMenuAccess> UserMenuAccesses { get; set; } = new List<UserMenuAccess>();
}