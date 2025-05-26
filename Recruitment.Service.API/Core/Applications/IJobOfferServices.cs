using Microsoft.AspNetCore.Mvc;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.JobOffer;

namespace Recruitment.Service.API.Core.Applications;

public interface IJobOfferServices
{
	Task<JsonResult> SaveJobOfferInformationService(JobOfferRequestDto jobOfferRequestDto);

	Task<JsonResult> RetrieveAllCandidateForJobOfferService(string? search, int start, int length, string draw,
		string sortColumnName, string sortDirection, int status);

	Task<JsonResult> RetrieveJobOfferInfoService(int jobOfferId);
	Task<JsonResult> UpdateJobOfferInformationService(int jobOfferInfoId, JobOfferRequestDto jobOfferRequestDto);
	Task<JsonResult> RetrieveJobOfferInfoPublicService(string jobOfferId);
	Task<JsonResult> JobOfferApprovedService(string jobOfferInfoId,
			string approverSignature);
	Task<JsonResult> JobOfferSalaryDeclinedService(string jobOfferInfoId, string approverNotes);
	Task<JsonResult> JobOfferAcceptedService(string jobOfferInfoId, string candidateSignature);
	Task<JsonResult> JobOfferDeclinedService(string jobOfferInfoId, string candidateNotes);
	Task<JsonResult> UpdateJobOfferStatusService(int jobOfferInfoId,
			int jobOfferStatusId);
	
	Task<JsonResult> RetrieveEmailBodyContentService(int candidateId);
	Task<byte[]> ExportCandidateToExcelService(int candidateId);
}