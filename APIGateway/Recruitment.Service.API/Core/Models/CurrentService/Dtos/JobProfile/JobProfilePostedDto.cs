namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.JobProfile
{
	public class JobProfilePostedDto
	{
		public int Id { get; set; }
		public string Position { get; set; }
		public string EmploymentType { get; set; }
		public string JobStatus { get; set; }
		public DateTime DatePosted { get; set; }

	}
}
