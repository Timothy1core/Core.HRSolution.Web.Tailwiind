#nullable disable


namespace HRApplicationDbLibrary.Core.Entities.Tables;

public class Api
{
	public int Id { get; set; }

	public string ApiPermission { get; set; }

	public bool IsActive { get; set; }

	public string CreatedBy { get; set; }

	public DateTime CreatedDate { get; set; }

	public virtual ICollection<UserApiPermission> UserApiPermissions { get; set; } = new List<UserApiPermission>();
}