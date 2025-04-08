using Microsoft.AspNetCore.Mvc;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;

namespace Recruitment.Service.API.Core.Applications;

public interface IAssessmentServices
{
    public Task<JsonResult> CreateAssessmentService(AssessmentRequestDto assessmentRequestDto, string createdBy);

    public Task<JsonResult> RetrieveAllAssessmentService(string? search, int start, int length, string draw,
        string sortColumnName, string sortDirection);
    public Task<JsonResult> RetrieveAssessmentService(int assessmentId);

    public Task<JsonResult> UpdateAssessmentService(int assessmentId, AssessmentUpdateRequestDto assessmentRequestDto,
        string createdBy);

    Task<JsonResult> RemoveAssessmentService(int assessmentId);
    public Task<JsonResult> RetrieveQuestionTypesService();
    public Task<JsonResult> CreateQuestionService(CreateQuestionRequestDto questionRequestDto, string createdBy);
    public Task<JsonResult> UpdateQuestionService(CreateQuestionRequestDto questionRequestDto, int questionId);
    public Task<JsonResult> RemoveQuestionService(int questionId);
}