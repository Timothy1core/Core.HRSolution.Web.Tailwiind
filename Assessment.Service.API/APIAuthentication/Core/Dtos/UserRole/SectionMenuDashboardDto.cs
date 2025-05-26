namespace APIAuthentication.Core.Dtos.UserRole;

public class SectionMenuDashboardDto
{
    public int Id { get; set; }
    public string SectionName { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedDate { get; set; }
    public string CreatedBy { get; set; }
    public int OrderBy { get; set; }
}