namespace APIAuthentication.Core.Dtos.UserRole;

public class ApiDashboardDto
{
    public int Id { get; set; }
    public string ApiPermission { get; set; }
    public bool IsActive { get; set; }

    public DateTime CreatedDate { get; set; }

    public string CreatedBy { get; set; }
}