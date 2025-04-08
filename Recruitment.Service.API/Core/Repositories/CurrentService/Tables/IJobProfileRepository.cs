using HRSolutionDbLibrary.Core.Entities.Tables;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.JobProfile;

namespace Recruitment.Service.API.Core.Repositories.CurrentService.Tables;

public interface IJobProfileRepository
{
    Task<List<DropDownValueDto>> SelectJobProfilesDropDown(int id);

    Task<List<DropDownValueDto>> SelectAllJobProfilesDropDown();

	Task CreateNewJobProfile(JobProfile jobProfile);
    Task<List<ClientJobProfileDashboardDto>> SelectJobProfileDashboard(int clientId);
    Task<List<ClientJobProfileDashboardDto>> JobProfileDashboard();
    Task<ClientJobProfileDashboardDto> SelectJobProfileApplicationProcess(int jobId);
    Task<ClientJobProfileInformationDto> SelectJobProfileInformation(int jobId);
    Task CreateJobProfileApplicationProcess(List<JobApplicationProcess> applicationProcesses);
    Task CreateJobProfileAssessment(List<JobAssessment> jobAssessments);
    Task UpdateJobProfile(JobProfile jobProfile, int id);
    Task<ApplicationFormJobProfileDetailsDto> SelectApplicationFormJobDetails(int jobId);
    Task<List<JobProfilePostedDto>> SelectCareersJobProfile();

    Task<JobProfile> SelectJobProfileRawData(int jobId);
}