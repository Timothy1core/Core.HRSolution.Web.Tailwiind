using Microsoft.AspNetCore.Mvc;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Onboarding;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.WorkFromHome;

namespace Recruitment.Service.API.Core.Applications
{
	public interface IOnboardingServices
	{
		//ONBOARDING
		#region 
		Task<JsonResult> SaveOnboardingInformationSheetService(OnboardingInformationSheetRequestDto onboardingInformationSheetDto);
		Task<JsonResult> RetrieveOnboardingInformationSheetService(int candidateId);

		Task<JsonResult> RetrieveOnboardingFormInformations(string candidateId);
		Task<JsonResult> RetrieveAllOnboardingInformationSheetService(string? search, int start, int length,
			string draw, string sortColumnName, string sortDirection, int status);
		Task<JsonResult> SaveOnboardingDocumentService(List<OnboardingDocumentRequestDto> onboardingDocumentDtoList);
		Task<JsonResult> RetrieveOnboardingDocumentService(int candidateId);
		Task<JsonResult> RetrieveAllOnboardingDocumentService(int candidateId);
		Task<JsonResult> UpdateOnboardingInformationService(string candidateId,
			OnboardingInformationSheetRequestDto onboardingInformationSheetDto);
		Task<JsonResult> UpdateOnboardingInformationInternalService(int candidateId, OnboardingInformationSheetRequestDto onboardingInformationSheetDto);
		Task<JsonResult> AcknowledgeOnboardingFormService(string candidateId,
			bool isAcknowledged);
		Task<JsonResult> UpdateOnboardingStatusService(int candidateId,
			int onboardingStatusId);
		Task<JsonResult> UpdateTemporaryEmployeeIdService(int candidateId, int temporaryEmployeeId);
		Task<(string filePath, string contentType)> RetrieveSpecificOnboardingDocument(int candidateId, string documentType);

		Task<List<(string filePath, string contentType)>> RetrieveAllOnboardingDocuments(int candidateId, string documentType);
		#endregion

		//WFH INFORMATION
		#region
		Task<JsonResult> SaveWorkFromHomeInformationService(WorkFromHomeInformationRequestDto workFromHomeInformationSheetDto);
		Task<JsonResult> RetrieveWorkFromHomeInformationService(int candidateId);
		Task<JsonResult> UpdateWorkFromHomeInformationService(string candidateId,
			WorkFromHomeInformationRequestDto workFromHomeInformationRequestDto);
		Task<JsonResult> WorkFromHomeInformationHrApproveService(int candidateId,
			string workFromHomeApprovalBy);
		Task<JsonResult> WorkFromHomeInformationItApproveService(int candidateId,
			string workFromHomeApprovalBy1);
		#endregion

		Task<JsonResult> RetrieveInformationForContractGenerationService(int candidateId);

		Task<byte[]?> GenerateContractPdfService(int candidateId, string loggedEmployee);

		Task<JsonResult> RetrieveExistingTemporaryIdListService();
	}
}
