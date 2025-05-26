namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.Onboarding;

public class OnboardingDocumentDto
{
	public int? CandidateId { get; set; }

	public string FileName { get; set; }

	public string DocumentType { get; set; }

	public bool? IsSubmitted { get; set; }

	public bool? IsHrverification { get; set; }

	public DateTime? DateSubmitted { get; set; }

	public int? DocumentGroup { get; set; }
	public IFormFile FormFile { get; set; }
}