namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.Onboarding
{
	public class CandidatePreRequisiteDocumentsResultDto
	{
		public bool HasNbiClearance { get; set; }
		public bool HasBirthCertificate { get; set; }
		public bool HasMedicalExam { get; set; }
	}
}
