using Assessment.Service.API.Core.Dto.Assessment;
using HRSolutionDbLibrary.Core.Entities.Tables;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;

namespace Assessment.Service.API.Core.Repositories.CurrentService.Tables;

public interface ICandidateRepository
{
    public Task<UserDto> SelectLoggedCandidateDetails(string loggedUserId);
    Task SubmitCandidateAnswer(CandidateAnswer candidateAnswer);

	Task SubmitCandidateSnapshot(CandidateSnapshot candidateSnapshot);
    Task<QuestionDto> RetrieveQuestionDetails(int questionId);
    Task SubmitAssessmentCorrection(AssessmentCorrection assessmentCorrection);
    Task SubmitAssessmentRemainingTime(AssessmentRemainingTimer assessmentRemainingTimer);
    Task UpdateAssessmentRemainingTime(int id, int remainingTimer);

    Task<AnswerDto> RetrieveAnswerDetails(int answerId);
}