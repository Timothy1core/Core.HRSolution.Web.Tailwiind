namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.EmailTemplate
{
	public class EmailTemplateDashboardDto
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public string Subject { get; set; }
		public string Body { get; set; }
		public string Cc { get; set; }
	}
}
