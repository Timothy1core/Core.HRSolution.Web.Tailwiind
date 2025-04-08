namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.GraphUtilities;

public class CreateCalendarEventRequestDto
{
	public string FromUserEmail { get; set; }
	public string Subject { get; set; }
	public string Body { get; set; }
	public DateTime StartTime { get; set; }
	public DateTime EndTime { get; set; }
	public string TimeZone { get; set; }
	public List<string> AttendeesEmails { get; set; }

	public CreateCalendarEventRequestDto()
	{
		AttendeesEmails = new List<string>();
	}
}