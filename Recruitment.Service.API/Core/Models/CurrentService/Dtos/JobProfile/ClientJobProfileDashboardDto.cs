namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.JobProfile
{
    public class ClientJobProfileDashboardDto
    {
        public int Id { get; set; }
        public string Position { get; set; }
        public string DateCreated{ get; set; }
        public string EmploymentType { get; set; }
        public string JobStatus { get; set; }
        public virtual ICollection<JobApplicationProcess> JobApplicationProcesses { get; set; } = new List<JobApplicationProcess>();
    }
}
