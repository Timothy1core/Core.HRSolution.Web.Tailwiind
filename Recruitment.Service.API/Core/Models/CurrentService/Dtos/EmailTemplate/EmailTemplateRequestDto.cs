namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.EmailTemplate
{
	public class EmailTemplateRequestDto
	{
		public string Name { get; set; }

		public string Subject { get; set; }

		public string EmailBody { get; set; }
		public string? EmailCc { get; set; }
	}
}
