using HRSolutionDbLibrary.Core.Entities.Tables;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Candidate;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Pipeline;
using System.Threading.Tasks;

namespace Recruitment.Service.API.Core.Repositories.CurrentService.Tables;

public interface ICandidateRepository
{
    Task SaveApplicationForm(Candidate candidate);

    Task<List<CandidateDto>> RetrieveCandidateList();

    Task<CandidateDto> RetrieveCandidateInfo(int candidateId);
    Task SaveHistoryItem(CandidateHistory candidateHistory);
    Task<List<CandidateHistoryDto>> RetrieveCandidateHistory(int candidateId);
    Task<List<JobAssessmentDto>> RetrieveCandidateAssessmentDetails(int jobId, int candidateId);

    Task<List<CandidateAssessmentDetailsDto>> RetrieveCandidateAssessmentAllDetails(int jobId,
	    int candidateId);

	Task<List<CandidateCommentDto>> RetrieveCandidateComment(int candidateId);

	Task SaveCommentItem(CandidateComment candidateComment);
    Task<Candidate> SelectCandidateInformation(int candidateId);
    Task CreateCandidateWriteUp(CandidateWriteUp candidateWriteUp);
    Task<List<CandidateWriteUpDto>> RetrieveWriteUpInfo(int candidateId);
    Task UpdateWriteUp(int id, CandidateWriteUpRequestDto candidateWriteUpDto);
    Task UpdateStage(int id, int stageId);
    Task UpdateJob(int id, int jobId, int stageId);
    Task RemovedCandidate(int id);
    Task<List<PipelineDto>> RetrievePipelineList();

	Task DisqualifyCandidate(int id);
    Task<AssessmentCheckingDto> RetrieveCandidateAssessmentCheckingDetails(int assessmentId, int candidateId);
    Task CreateCandidateCredential(CandidateCredential candidateCredential);
    Task SetAssessmentCredentialInactive(int id);

    Task<List<DropDownValueDto>> SelectSourceDropDown();
    Task SubmitCandidateCorrection(int id, bool isCorrect);
    Task RemoveCandidateCredential(int id);

	#region JobOffer

	Task<List<CandidateDto>> RetrieveCandidateToOfferList();

	#endregion
}