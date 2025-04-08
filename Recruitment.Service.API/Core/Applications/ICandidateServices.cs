using HRSolutionDbLibrary.Core.Entities.Tables;
using Microsoft.AspNetCore.Mvc;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Candidate;
using System.Security.Cryptography.X509Certificates;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;

namespace Recruitment.Service.API.Core.Applications;

public interface ICandidateServices
{
    Task<JsonResult> ApplyCandidateApplicationForm(ApplyRequestDto applyRequest);

    Task<JsonResult> RetrieveAllCandidateService(
        string? search, int start, int length, string draw,
        string sortColumnName, string sortDirection,
        int client, int clientGroup, int job, int qualification, int applicationProcess, int source);

    Task<JsonResult> RetrieveCandidateFilterService();
    Task<JsonResult> RetrieveCandidateService(int candidateId);
    Task<JsonResult> CreateCommentService(CandidateCommentRequestDto comment);


	Task<JsonResult> CreateCandidateWriteUpService(CandidateWriteUpRequestDto candidateWriteUpDto, int candidateId,
        string createdBy);
    Task<JsonResult> UpdateCandidateStageService(int candidateId, int stageId, string stageName, string loggedEmployee);
    Task<JsonResult> RetrieveCandidateWriteUpService(int candidateId);
    Task<JsonResult> UpdateWriteUpService(int writeUpId, CandidateWriteUpRequestDto writeUpRequest);
    Task<JsonResult> UpdateCandidateJobService(int candidateId, int jobId, int stageId,string jobName,string stageName,string loggedEmployee);

    Task<JsonResult> CopyCandidateToJobService(CopyToJobRequestDto candidateDto, string jobName, string stageName);

    Task<(string filePath, string contentType)> RetrieveCandidateResume(int candidateId);
    Task<JsonResult> RemoveRoleService(int id);
    Task<JsonResult> DisqualifyCandidateService(int id, string loggedEmployee);
    Task<JsonResult> RetrieveAllPipeline();
    Task<JsonResult> RetrieveCandidateAssessmentCheckingService(int assessmentId, int candidateId);

    Task<JsonResult> CreateCandidateCredentialForAssessment(candidateCredentialRequestDto candidateRequest,
        string loggedEmployee);

    Task<JsonResult> SubmitCandidateCorrectionService(int id, bool isCorrect);

    Task<JsonResult> RetrieveCandidateToOfferService(string? search, int start, int length, string draw,
	    string sortColumnName, string sortDirection, int status);

}