#nullable disable
namespace HRApplicationDbLibrary.Core.Entities.Tables;

public class UserCredential
{
	public int Id { get; set; }

	public string EmployeeId { get; set; }
	public string Email { get; set; }

	public string Password { get; set; }

	public bool IsActive { get; set; }

	public int LogInAttempt { get; set; }

	public bool IsLockOut { get; set; }

	public int RoleId { get; set; }

	public virtual UserRole Role { get; set; }
}