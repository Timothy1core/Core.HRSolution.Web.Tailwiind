using HRSolutionDbLibrary.Core.Entities.Tables;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.JobOffer;

namespace Recruitment.Service.API.Core.Repositories.CurrentService.Tables;

public interface IJobOfferRepository
{
	Task SaveJobOfferInformation(JobOfferInformation jobOfferInformation);
	Task<List<JobOfferDashboardDto>> RetrieveCandidateForJobOfferList(int status);
	Task<JobOfferDto> RetrieveJobOfferInfo(int jobOfferId);
	Task UpdateJobOffer(JobOfferInformation jobOfferInformationDto);
	Task JobOfferApproved(JobOfferInformation jobOfferInformationDto);
	Task JobOfferSalaryDeclined(JobOfferInformation jobOfferInformationDto);
	Task JobOfferAccepted(JobOfferInformation jobOfferInformationDto);
	Task JobOfferDeclined(JobOfferInformation jobOfferInformationDto);
	Task UpdateJobOfferStatus(JobOfferInformation jobOfferInformationDto);
}