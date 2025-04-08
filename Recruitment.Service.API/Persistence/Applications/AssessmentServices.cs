using FileServiceLibrary;
using HRSolutionDbLibrary.Core.Entities.Tables;
using Microsoft.AspNetCore.Mvc;
using Recruitment.Service.API.Core.Applications;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;
using Recruitment.Service.API.Core.UnitOfWork;
using System.Linq.Dynamic.Core;

namespace Recruitment.Service.API.Persistence.Applications
{
    public class AssessmentServices(
        IUoWForCurrentService uoWForCurrentService,
        ILogger<AssessmentServices> logger,
        IWebHostEnvironment webHostEnvironment,
        IConfiguration configuration,
        IFileService fileService
    ) : IAssessmentServices
    {
        private readonly IUoWForCurrentService _uoWForCurrentService = uoWForCurrentService;
        private readonly ILogger<AssessmentServices> _logger = logger;
        public async Task<JsonResult> CreateAssessmentService(AssessmentRequestDto assessmentRequestDto, string createdBy)
        {
            JsonResult result;
            try
            {
                var assessment = new Assessment()
                {
                    Name = assessmentRequestDto.Name,
                    Instruction = assessmentRequestDto.Instruction,
                    IsActive = true,
                    Duration = assessmentRequestDto.Duration,
                    Description = assessmentRequestDto.Description,
                    CreatedBy = createdBy,
                    CreatedDate = DateTime.UtcNow.AddHours(8),
                    ModifiedDate = null,
                    AssessmentQuestions = assessmentRequestDto.Questions.Select(x => new AssessmentQuestion()
                    {
                        Body = x.Body,
                        Type = x.Type,
                        Required = x.Required,
                        Marks = x.Marks,
                        IsActive = true,
                        AssessmentAnswers = x.Answers.Select(a => new AssessmentAnswer()
                        {
                            AnswerBody = a.AnswerBody
                        }).ToList(),
                        AssessmentChoices = x.Choices.Select(c => new AssessmentChoice()
                        {
                            ChoiceBody = c.ChoiceBody
                        }).ToList(),

                        AssessmentVideoDurations = x.VideoDurations.Select(v => new AssessmentVideoDuration()
                        {
                            VideoDurationMinute = v.VideoDurationMinute
                        }).ToList(),
                    }).ToList()
                };

                await _uoWForCurrentService.AssessmentRepository.CreateAssessment(assessment);
                await _uoWForCurrentService.CommitAsync();

                result = new JsonResult(new { success = true, responseText = "Assessment Successfully Saved " })
                {
                    StatusCode = 200
                };
                return result;

            }
            catch (Exception e)
            {
                _logger.LogError($"Error occurred while creating assessment: {e.Message}");

                result = new JsonResult(new
                    { success = false, responseText = $"Error occurred while creating assessment: {e.Message}" })
                {
                    StatusCode = 400
                };
                return result;

            }
        }

        public async Task<JsonResult> RetrieveAllAssessmentService(string? search, int start, int length, string draw, string sortColumnName, string sortDirection)
        {
            JsonResult result;
            try
            {
                var assessments = await _uoWForCurrentService.AssessmentRepository.RetrieveAssessmentList();

                var totalRows = assessments.Count();

                assessments = !string.IsNullOrEmpty(search) ? assessments.Where(x =>
                    x.CreatedBy.ToLower().Contains(search.ToLower()) ||
                    x.Name.ToLower().Contains(search.ToLower()) ||
                    x.Instruction.ToLower().Contains(search.ToLower()) ||
                    x.Description.ToLower().Contains(search.ToLower())).ToList() : assessments.ToList();

                var totalRowsAfterFiltering = assessments.Count();

                assessments = assessments.AsQueryable().OrderBy(sortColumnName + " " + sortDirection).ToList();
                assessments = length != -1 ? assessments.Skip(start).Take(length).ToList() : assessments.ToList();

                result = new JsonResult(new { data = assessments, draw, recordsTotal = totalRows, recordsFiltered = totalRowsAfterFiltering })
                {
                    StatusCode = 200
                };
                return result;

            }
            catch (Exception e)
            {
                _logger.LogError($"Error occurred while retrieving assessment: {e.Message}");

                result = new JsonResult(new
                    { success = false, responseText = $"Error occurred while retrieving assessment: {e.Message}" })
                {
                    StatusCode = 400
                };
                return result;

            }
        }

        public async Task<JsonResult> RetrieveAssessmentService(int assessmentId)
        {
            JsonResult result;
            try
            {
        
                var assessment =
                    await _uoWForCurrentService.AssessmentRepository.RetrieveAssessmentInfo(assessmentId);
        
                result = new JsonResult(new { assessment })
                {
                    StatusCode = 200
                };
                return result;
        
            }
            catch (Exception e)
            {
                _logger.LogError($"Error occurred while retrieving assessment: {e.Message}");
        
                result = new JsonResult(new
                    { success = false, responseText = $"Error occurred while retrieving assessment: {e.Message}" })
                {
                    StatusCode = 400
                };
                return result;
        
            }
        }
        
        public async Task<JsonResult> UpdateAssessmentService(int assessmentId, AssessmentUpdateRequestDto assessmentRequestDto, string createdBy)
        {
            JsonResult result;
            try
            {
                var assessment = new Assessment()
                {
                    Id = assessmentId,
                    Name = assessmentRequestDto.Name,
                    Instruction = assessmentRequestDto.Instruction,
                    Description = assessmentRequestDto.Description,
                    Duration = assessmentRequestDto.Duration,
                    ModifiedBy = createdBy,
                    ModifiedDate = DateTime.UtcNow.AddHours(8),
                };
                await _uoWForCurrentService.AssessmentRepository.UpdateAssessment(assessment);
                await _uoWForCurrentService.CommitAsync();
        
                result = new JsonResult(new { success = true, responseText = "Assessment Successfully Updated" })
                {
                    StatusCode = 200
                };
                return result;
        
            }
            catch (Exception e)
            {
                _logger.LogError($"Error occurred while updating assessment: {e.Message}");
        
                result = new JsonResult(new
                    { success = false, responseText = $"Error occurred while updating assessment: {e.Message}" })
                {
                    StatusCode = 400
                };
                return result;
        
            }
        }
        
        public async Task<JsonResult> RemoveAssessmentService(int assessmentId)
        {
            JsonResult result;
            try
            {
        
                await _uoWForCurrentService.AssessmentRepository.RemoveAssessment(assessmentId);
                await _uoWForCurrentService.CommitAsync();
        
                result = new JsonResult(new { success = true, responseText = "Assessment Successfully Removed " })
                {
                    StatusCode = 200
                };
                return result;
        
            }
            catch (Exception e)
            {
                _logger.LogError($"Error occurred while removing assessment: {e.Message}");
        
                result = new JsonResult(new
                    { success = false, responseText = $"Error occurred while removing assessment: {e.Message}" })
                {
                    StatusCode = 400
                };
                return result;
        
            }
        }

        public async Task<JsonResult> CreateQuestionService(CreateQuestionRequestDto questionRequestDto, string createdBy)
        {
            JsonResult result;
            try
            {
        
                var question =  new AssessmentQuestion()
                {
                    AssessmentId = questionRequestDto.AssessmentId,
                    Body = questionRequestDto.Body,
                    Type = questionRequestDto.Type,
                    Required = questionRequestDto.Required,
                    Marks = questionRequestDto.Marks,
                    IsActive = true,
                    AssessmentAnswers = questionRequestDto.Answers.Select(a => new AssessmentAnswer()
                    {
                        AnswerBody = a.AnswerBody
                    }).ToList(),
                    AssessmentVideoDurations = questionRequestDto.VideoDurations.Select(v => new AssessmentVideoDuration()
                    {
                        VideoDurationMinute = v.VideoDurationMinute
                    }).ToList(),
                    AssessmentChoices = questionRequestDto.Choices.Select(c => new AssessmentChoice()
                    {
                        ChoiceBody = c.ChoiceBody
                    }).ToList(),
                };
        
        
                await _uoWForCurrentService.AssessmentRepository.CreateQuestion(question);
                await _uoWForCurrentService.CommitAsync();
        
                result = new JsonResult(new { success = true, responseText = "Question Successfully Saved" })
                {
                    StatusCode = 200
                };
                return result;
        
            }
            catch (Exception e)
            {
                _logger.LogError($"Error occurred while creating question: {e.Message}");
        
                result = new JsonResult(new
                { success = false, responseText = $"Error occurred while creating question: {e.Message}" })
                {
                    StatusCode = 400
                };
                return result;
        
            }
        }

        public async Task<JsonResult> UpdateQuestionService(CreateQuestionRequestDto questionRequestDto, int questionId)
        {
            JsonResult result;
            try
            {

                var question = new AssessmentQuestion()
                {
                    Id = questionId,
                    Body = questionRequestDto.Body,
                    Type = questionRequestDto.Type,
                    Required = questionRequestDto.Required,
                    Marks = questionRequestDto.Marks,
                    AssessmentAnswers = questionRequestDto.Answers.Select(a => new AssessmentAnswer()
                    {
                        Id = a.Id,
                        AnswerBody = a.AnswerBody
                    }).ToList(),
                    AssessmentChoices = questionRequestDto.Choices.Select(c => new AssessmentChoice()
                    {
                        Id = c.Id,
                        ChoiceBody = c.ChoiceBody
                    }).ToList(),
                    AssessmentVideoDurations = questionRequestDto.VideoDurations.Select(v => new AssessmentVideoDuration()
                    {
                        Id = v.Id,
                        VideoDurationMinute = v.VideoDurationMinute
                    }).ToList(),
                };


                await _uoWForCurrentService.AssessmentRepository.UpdateQuestion(question);
                await _uoWForCurrentService.CommitAsync();

                result = new JsonResult(new { success = true, responseText = "Question Successfully Saved" })
                {
                    StatusCode = 200
                };
                return result;

            }
            catch (Exception e)
            {
                _logger.LogError($"Error occurred while creating question: {e.Message}");

                result = new JsonResult(new
                    { success = false, responseText = $"Error occurred while creating question: {e.Message}" })
                {
                    StatusCode = 400
                };
                return result;

            }
        }


        public async Task<JsonResult> RemoveQuestionService(int questionId)
        {
            JsonResult result;
            try
            {

                await _uoWForCurrentService.AssessmentRepository.RemoveQuestion(questionId);
                await _uoWForCurrentService.CommitAsync();

                result = new JsonResult(new { success = true, responseText = "Question Successfully Removed " })
                {
                    StatusCode = 200
                };
                return result;

            }
            catch (Exception e)
            {
                _logger.LogError($"Error occurred while removing question: {e.Message}");

                result = new JsonResult(new
                    { success = false, responseText = $"Error occurred while removing question: {e.Message}" })
                {
                    StatusCode = 400
                };
                return result;

            }
        }
        public async Task<JsonResult> RetrieveQuestionTypesService()
        {
            JsonResult result;
            try
            {
                var questionTypes = await _uoWForCurrentService.AssessmentRepository.RetrieveQuestionTypeList();

                result = new JsonResult(new { questionTypes })
                {
                    StatusCode = 200
                };
                return result;

            }
            catch (Exception e)
            {
                _logger.LogError($"Error occurred while retrieving question types: {e.Message}");

                result = new JsonResult(new
                    { success = false, responseText = $"Error occurred while retrieving question types: {e.Message}" })
                {
                    StatusCode = 400
                };
                return result;

            }
        }
    }
}