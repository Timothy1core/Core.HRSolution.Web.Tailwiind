namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.EmailTemplate
{
	public class EmailTemplateActionDto
	{
		public int Id { get; set; }
		public string ActionName { get; set; }

		public List<EmailTemplateDashboardDto> EmailTemplateDashboard { get; set; }
	}
}
