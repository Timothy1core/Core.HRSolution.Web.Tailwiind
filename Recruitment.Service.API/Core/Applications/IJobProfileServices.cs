using Microsoft.AspNetCore.Mvc;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.JobProfile;

namespace Recruitment.Service.API.Core.Applications;

public interface IJobProfileServices
{
    Task<JsonResult> CreateClientJobProfile(ClientJobProfileRequestDto jobProfileRequest, string loggedEmployee);
    Task<JsonResult> CreateJobApplicationForm(List<JobApplicationQuestionRequestDto> jobApplicationQuestionRequest, string loggedEmployee);
    Task<JsonResult> CreateClientJobProfileApplicationProcess(JobApplicationProcessRequestDto jobApplicationQuestionRequest);
    Task<JsonResult> CreateClientJobProfileAssessment(List<JobApplicationAssessmentRequestDto> jobApplicationAssessmentRequests, string loggedEmployee);
    Task<JsonResult> RetrieveClientJobProfileDashboard(int companyId);
    Task<JsonResult> RetrieveJobProfileDashboard();
    Task<JsonResult> RetrieveClientJobProfileInformation(int jobId);

    Task<JsonResult> UpdateClientJobProfile(ClientJobProfileRequestDto jobProfileRequest, int jobId);
    Task<JsonResult> RetrieveApplicationFormJobProfile(int jobId);

    Task<JsonResult> RetrieveApplicationProcess();

    Task<JsonResult> RetrieveCareersJobProfileDashboard();

    Task<JsonResult> SelectAllJobProfileDropDown();

    Task<JsonResult> SelectApplicationProcessDropDown();
    Task<(string filePath, string contentType)> GenerateJobProfilePdf(int jobId);
    Task<(string filePath, string contentType)> ViewMarketScanFile(int jobId, string filename);


}