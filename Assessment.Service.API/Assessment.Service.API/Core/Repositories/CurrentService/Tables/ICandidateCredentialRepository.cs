using System.Threading.Tasks;
using HRSolutionDbLibrary.Core.Entities.hris.Tables;

public interface ICandidateCredentialRepository
{
    Task<CandidateCredential> AuthenticateAsync(string email);
    Task SetDefaultLogInAttempts(int id);
    Task SetLogInAttempts(int id);
    Task UpdateAssessmentIsStartedStatus(CandidateCredential candidateCredential);
    Task UpdateAssessmentIsFinishedStatus(CandidateCredential candidateCredential);
    Task SaveHistoryItem(CandidateHistory candidateHistory);
    Task SubmitAssessmentDetails(CandidateCredential candidateCredential);
    Task SetAssessmentMouseOut(CandidateCredential candidateCredential);
    Task SetCurrentAssessmentId(CandidateCredential candidateCredential);
    Task UpdateAssessmentRemainingTimerId(int id, int remainingTimerId);
}