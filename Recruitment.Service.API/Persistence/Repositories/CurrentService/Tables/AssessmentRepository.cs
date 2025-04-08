using HRSolutionDbLibrary.Core.Entities.Tables;
using HRSolutionDbLibrary.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;
using Recruitment.Service.API.Core.Repositories.CurrentService.Tables;

namespace Recruitment.Service.API.Persistence.Repositories.CurrentService.Tables;

public class AssessmentRepository(CurrentServiceDbContext context) : IAssessmentRepository
{
    #region Assessment
    public async Task CreateAssessment(Assessment assessment)
    {
        await context.Assessments.AddAsync(assessment);
    }

    public async Task<List<AssessmentDashboardDto>> RetrieveAssessmentList()
    {
        var assessments = await context.Assessments
            .Where(x => x.IsActive == true)
            .Include(i => i.AssessmentQuestions)
            .Select(s => new AssessmentDashboardDto()
            {
                Id = s.Id,
                Name = s.Name,
                Instruction = s.Instruction,
                CreatedDate = s.CreatedDate,
                CreatedBy = s.CreatedBy,
                Duration = s.Duration,
                Description = s.Description
                // Questions = s.Questions.Select(x => new Question()
                // {
                //     Body = x.Body,
                //     Required = x.Required,
                //     Choices = x.Choices.Select(c => new Choice()
                //     {
                //         ChoiceBody = c.ChoiceBody,
                //         QuestionId = c.QuestionId
                //     }).ToList(),
                //     Type = x.Type,
                //     Answers = x.Answers.Select(a => new Answer()
                //     {
                //         AnswerBody = a.AnswerBody,
                //         QuestionId = a.QuestionId
                //     }).ToList(),
                // }).ToList()
            })
            .ToListAsync();
        return assessments;

    }

    public async Task<AssessmentDashboardDto> RetrieveAssessmentInfo(int assessmentId)
    {
        var assessment = await context.Assessments
            .Include(x => x.AssessmentQuestions)
            .Where(x => x.Id == assessmentId)
            .Select(s => new AssessmentDashboardDto
            {
                Id = s.Id,
                Name = s.Name,
                Instruction = s.Instruction,
                CreatedDate = s.CreatedDate,
                CreatedBy = s.CreatedBy,
                Description = s.Description,
                Duration = s.Duration,
                Questions = s.AssessmentQuestions.Where(x => x.IsActive == true).Select(x => new AssessmentQuestion()
                {
                    Id = x.Id,
                    Body = x.Body,
                    Required = x.Required,
                    AssessmentId = x.AssessmentId,
                    Marks = x.Marks,
                    AssessmentChoices = x.AssessmentChoices.Select(c => new AssessmentChoice()
                    {
                        Id = c.Id,
                        ChoiceBody = c.ChoiceBody,
                        QuestionId = c.QuestionId
                    }).ToList(),
                    Type = x.Type,
                    AssessmentAnswers = x.AssessmentAnswers.Select(a => new AssessmentAnswer()
                    {
                        Id = a.Id,
                        AnswerBody = a.AnswerBody,
                        QuestionId = a.QuestionId
                    }).ToList(),
                    AssessmentVideoDurations = x.AssessmentVideoDurations.Select(a => new AssessmentVideoDuration()
                    {
                        Id = a.Id,
                        VideoDurationMinute = a.VideoDurationMinute,
                        QuestionId = a.QuestionId
                    }).ToList(),
                }).ToList()
                // You can map more fields here if needed from the Assessment entity
            })
            .FirstOrDefaultAsync();

        return assessment!;

    }

    public async Task UpdateAssessment(Assessment assessmentDto)
    {
        var assessment = await context.Assessments.FirstOrDefaultAsync(x => x.Id == assessmentDto.Id);

        if (assessment != null)
        {
            assessment.Name = assessmentDto.Name;
            assessment.Instruction = assessmentDto.Instruction;
            assessment.Description = assessmentDto.Description;
            assessment.Duration = assessmentDto.Duration;
            assessment.ModifiedBy = assessmentDto.ModifiedBy;
            assessment.ModifiedDate = assessmentDto.ModifiedDate;
        }
    }

    public async Task RemoveAssessment(int assessmentId)
    {
        var assessmentData = await context.Assessments.FirstOrDefaultAsync(x => x.Id == assessmentId);

        if (assessmentData != null) assessmentData.IsActive = false;
    }

    #endregion


    

    #region Question
    public async Task CreateQuestion(AssessmentQuestion createQuestion)
    {

        await context.AssessmentQuestions.AddAsync(createQuestion);
        
    }

    public async Task UpdateQuestion(AssessmentQuestion updateQuestion)
    {
        var question = await context.AssessmentQuestions
            .Include(q => q.AssessmentAnswers)
            .Include(q => q.AssessmentChoices)
            .Include(q => q.AssessmentVideoDurations)
            .FirstOrDefaultAsync(q => q.Id == updateQuestion.Id);

        if (question != null)
        {
            question.Type = updateQuestion.Type;
            question.Body = updateQuestion.Body;
            question.Required = updateQuestion.Required;
            question.Marks = updateQuestion.Marks;

            // Update Answers
            foreach (var updatedAnswer in updateQuestion.AssessmentAnswers)
            {
                var existingAnswer = question.AssessmentAnswers.FirstOrDefault(a => a.Id == updatedAnswer.Id);
                if (existingAnswer != null)
                {
                    existingAnswer.AnswerBody = updatedAnswer.AnswerBody;
                }
                else
                {
                    // question.Answers.Add(new Answer
                    // {
                    //     AnswerBody = updatedAnswer.AnswerBody,
                    // });
                    updatedAnswer.QuestionId = updateQuestion.Id;
                    await context.AssessmentAnswers.AddAsync(updatedAnswer);
                }
            }

            // Update VideoDurations
            foreach (var updatedVideoDurations in updateQuestion.AssessmentVideoDurations)
            {
                var existingVideoDurations = question.AssessmentVideoDurations.FirstOrDefault(a => a.Id == updatedVideoDurations.Id);
                if (existingVideoDurations != null)
                {
                    existingVideoDurations.VideoDurationMinute = updatedVideoDurations.VideoDurationMinute;
                }
                else
                {
                    // question.VideoDurations.Add(new VideoDuration
                    // {
                    //     VideoDurationMinute = updatedVideoDurations.VideoDurationMinute,
                    // });
                    updatedVideoDurations.QuestionId = updateQuestion.Id;
                    await context.AssessmentVideoDurations.AddAsync(updatedVideoDurations);
                }
            }

            // Update Choices
            foreach ( var updatedChoice in updateQuestion.AssessmentChoices)
            {
                var existingChoice = question.AssessmentChoices.FirstOrDefault(c => c.Id == updatedChoice.Id);
                if (existingChoice != null)
                {
                    existingChoice.ChoiceBody = updatedChoice.ChoiceBody;
                }

            }

            foreach (var updatedChoice in updateQuestion.AssessmentChoices)
            {
                if (updatedChoice.Id != 0) continue; // New choice
                // Create a new instance of Choice to avoid reusing the same reference
                var newChoice = new AssessmentChoice
                {
                    ChoiceBody = updatedChoice.ChoiceBody,
                    QuestionId = updateQuestion.Id
                };
                await context.AssessmentChoices.AddAsync(newChoice);
            }

            // **Delete Choices**
            // Find choices that are in the database but not in the updated list
            var updatedChoiceIds = updateQuestion.AssessmentChoices.Select(c => c.Id).ToList();
            var choicesToRemove = question.AssessmentChoices.Where(c => !updatedChoiceIds.Contains(c.Id)).ToList();
            
            // Remove the identified choices
            foreach (var choiceToRemove in choicesToRemove)
            {
                context.AssessmentChoices.Remove(choiceToRemove);
            }

            // **Delete Choices**
            // Get IDs of updated choices
            // var updatedChoiceIds = updateQuestion.Choices.Select(c => c.Id).ToList();

            // Find choices in the database that are not in the updated list
            // var choicesToRemove = question.Choices.Where(c => !updatedChoiceIds.Contains(c.Id)).ToList();

            // Remove choices not in the updated list
            // context.Choices.RemoveRange(choicesToRemove);


            await context.SaveChangesAsync();
        }
    }

    public async Task RemoveQuestion(int questionId)
    {
        var question = await context.AssessmentQuestions.FirstOrDefaultAsync(x => x.Id == questionId);

        if (question != null) question.IsActive = false;
    }
    #endregion


    public async Task<List<AssessmentQuestionType>> RetrieveQuestionTypeList()
    {
        var questionTypes = await context.AssessmentQuestionTypes
            .Select(q => new AssessmentQuestionType()
            {
                Id = q.Id,
                TypeName = q.TypeName
            })
            .ToListAsync();

        return questionTypes;

    }
}