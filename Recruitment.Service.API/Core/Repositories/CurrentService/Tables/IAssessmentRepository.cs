using HRSolutionDbLibrary.Core.Entities.Tables;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;

namespace Recruitment.Service.API.Core.Repositories.CurrentService.Tables;

public interface IAssessmentRepository
{
    public Task CreateAssessment(Assessment assessment);
    public Task<List<AssessmentDashboardDto>> RetrieveAssessmentList();
    public Task<AssessmentDashboardDto> RetrieveAssessmentInfo(int assessmentId);
    public Task UpdateAssessment(Assessment assessmentDto);

    public Task RemoveAssessment(int assessmentId);
    public Task<List<AssessmentQuestionType>> RetrieveQuestionTypeList();


    public Task CreateQuestion(AssessmentQuestion createQuestion);

    public Task UpdateQuestion(AssessmentQuestion updateQuestion);
    public Task RemoveQuestion(int questionId);
}