namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.GraphUtilities;

public class SendEmailRequestDto
{
	public string FromUserEmail { get; set; }
	public string? ToUserEmail { get; set; }
	public string Subject { get; set; }
	public string Body { get; set; }
}