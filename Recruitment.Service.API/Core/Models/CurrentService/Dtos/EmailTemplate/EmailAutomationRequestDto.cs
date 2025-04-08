namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.EmailTemplate
{
	public class EmailAutomationRequestDto
	{
		public int Type { get; set; }
		public int Template { get; set; }
		public int? Job { get; set; }
		public int? Stage { get; set; }
		public bool Disqualified { get; set; }
	}
}
