using Assessment.Service.API.Core.Dto.Assessment;
using Assessment.Service.API.Core.Dto.NewFolder;
using Microsoft.AspNetCore.Mvc;

namespace Assessment.Service.API.Core.Applications;

public interface IAssessmentServices
{
    Task<JsonResult> AuthenticateCandidateService(LoginRequestDto loginRequest);
    Task<JsonResult> AuthenticateCandidateVerificationService(string authHeader);
    Task<JsonResult> UpdateAssessmentIsStartedStatusService(int assessmentId);
    Task<JsonResult> UpdateAssessmentIsFinishedStatusService(int id, int candidateId);
    Task<JsonResult> SubmitAssessmentAnswerService(AssessmentAnswerDto assessmentAnswerDto);

    Task<JsonResult> SubmitCandidateSnapshotService(CandidateSnapshotDto candidateSnapshotDto);
    Task<JsonResult> SubmitAssessmentDetailsService(int id, bool isFullscreenExit, bool isMouseExited);
    Task<JsonResult> SetAssessmentMouseOutService(int id, int mouseOutsideCounter);
    Task<JsonResult> SetCurrentAssessmentIdService(int id, int assessmentId);

    Task<JsonResult> SubmitAssessmentRemainingTimeService(AssessmentRemainingTimerDto assessmentRemainingTimerDto,
        int id);

    Task<JsonResult> UpdateAssessmentRemainingTimeService(int id, int remainingTime);

    Task<(string filePath, string contentType)> RetrieveCandidateVideo(int answerId);
}