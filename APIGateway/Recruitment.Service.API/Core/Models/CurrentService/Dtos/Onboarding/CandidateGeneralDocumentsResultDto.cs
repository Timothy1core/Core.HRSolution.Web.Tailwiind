namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.Onboarding
{
	public class CandidateGeneralDocumentsResultDto
	{
		public bool HasPagibig { get; set; }
		public bool HasPhilhealth { get; set; }
		public bool HasTin { get; set; }
		public bool HasSss { get; set; }
		public bool HasDiploma { get; set; }
		public bool HasMarriageCert { get; set; }
		public bool HasDependentCert { get; set; }
		public bool HasEmploymentCert { get; set; }
		public bool HasForm2316 { get; set; }
	}
}
