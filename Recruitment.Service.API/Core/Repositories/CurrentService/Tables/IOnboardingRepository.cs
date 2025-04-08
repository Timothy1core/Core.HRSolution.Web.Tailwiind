using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Onboarding;

namespace Recruitment.Service.API.Core.Repositories.CurrentService.Tables
{
	public interface IOnboardingRepository
	{
		Task SaveOnboardingInformation(OnboardingInformationSheet onboardingInformationSheet);
		Task<OnboardingInformationSheetDto> RetrieveOnboardingInformation(int candidateId);
		Task<List<OnboardingInformationSheetDashboardDto>> RetrieveCandidateOnboardingInfoList();
		Task UpdateOnboardingInformation(OnboardingInformationSheet onboardingInformationDto);
		Task AcknowledgeOnboardingForm(int id, bool isAcknowledged);
		Task SaveOnboardingDocument(OnboardingDocument onboardingDocument);
		Task<OnboardingDocumentDto> RetrieveOnboardingDocument(int candidateId, string documentType);
		Task<List<OnboardingDocumentDto>> RetrieveAllOnboardingDocuments(int candidateId, string documentType);
		Task<List<OnboardingDocumentDto>> RetrieveCandidateOnboardingDocuments(int candidateId);
		Task<CandidatePreRequisiteDocumentsResultDto> RetrieveCandidatePreRequisiteDocumentsResult(int candidateId);
		Task<CandidateGeneralDocumentsResultDto> RetrieveCandidateGeneralDocumentsResult(int candidateId);
		Task UpdateOnboardingStep(int candidateId, int step);
	}
}
