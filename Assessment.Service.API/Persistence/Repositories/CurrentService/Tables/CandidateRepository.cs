using Assessment.Service.API.Core.Dto.Assessment;
using Assessment.Service.API.Core.Repositories.CurrentService.Tables;
using HRSolutionDbLibrary.Core.Entities.Tables;
using HRSolutionDbLibrary.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Assessment.Service.API.Core.Dto.NewFolder;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;

namespace Assessment.Service.API.Persistence.EntityConfigurations.CurrentService.Tables;

public class CandidateRepository(CurrentServiceDbContext context) : ICandidateRepository
{
    public async Task<UserDto> SelectLoggedCandidateDetails(string loggedUserId)
    {
        int parsedUserId = int.Parse(loggedUserId); // Convert string to integer
        var candidateDetails = await context.Candidates.Select(s => new UserDto()
        {
            Id = s.Id,
            FirstName = s.FirstName,
            LastName = s.LastName,
            Email = s.Email,
            JobName = s.Job.Position,

            CandidateCredentials = s.CandidateCredentials.Select(x => new CandidateCredentialDto()
            {
                Id = x.Id,
                CandidateId = x.CandidateId,
                Expiration = x.Expiration,
                IsAssessmentStarted = x.IsAssessmentStarted,
                IsFullscreenExit = x.IsFullscreenExit,
                IsMouseExited = x.IsMouseExited,
                IsAssessmentFinished = x.IsAssessmentFinished,
                CurrentAssessmentId = x.CurrentAssessmentId,
                MouseOutsideCounter = x.MouseOutsideCounter,
                AssessmentTimerId = x.AssessmentTimerId,
                AssessmentTimer = x.AssessmentRemainingTimer,
            }).ToList(),

            Assessments = s.Job.JobAssessments.Where(x => x.AssessmentId != null).Select(x =>
                new HRSolutionDbLibrary.Core.Entities.Tables.Assessment()
                {
                    Id = x.Assessment.Id,
                    Name = x.Assessment.Name,
                    Instruction = x.Assessment.Instruction,
                    Duration = x.Assessment.Duration,
                    Description = x.Assessment.Description,
                    AssessmentRemainingTimers = x.Assessment.AssessmentRemainingTimers.Where(timer => timer.CandidateId == parsedUserId).Select(timer =>
                        new AssessmentRemainingTimer()
                        {
                            Id = timer.Id,
                            RemainingTime = timer.RemainingTime,
                            AssessmentId = timer.AssessmentId,
                            CandidateId = timer.CandidateId
                        }).ToList(),

                    AssessmentQuestions = x.Assessment.AssessmentQuestions.Where(x => x.IsActive == true).Select(question => new AssessmentQuestion()
                    {
                        Id = question.Id,
                        Body = question.Body,
                        AssessmentId = question.AssessmentId,
                        Type = question.Type,
                        Required = question.Required,
                        Marks = question.Marks,
                        CandidateAnswers = question.CandidateAnswers.Where(assessmentAnswers => assessmentAnswers.CandidateId == parsedUserId).Select(assessmentAnswers =>
                            new CandidateAnswer()
                            {
                                Id = assessmentAnswers.Id,
                                AssessmentAnswerBody = assessmentAnswers.AssessmentAnswerBody,
                                QuestionId = assessmentAnswers.QuestionId,
                            }).ToList(),
                        AssessmentChoices = question.AssessmentChoices.Select(choice => new AssessmentChoice()
                        {
                            Id = choice.Id,
                            ChoiceBody = choice.ChoiceBody,
                            QuestionId = choice.QuestionId,
                        }).ToList(),
                        AssessmentVideoDurations = question.AssessmentVideoDurations.Select(duration => new AssessmentVideoDuration()
                        {
                            Id = duration.Id,
                            QuestionId = duration.QuestionId,
                            VideoDurationMinute = duration.VideoDurationMinute,
                        }).ToList()

                    }).ToList(),
                }
            ).ToList()

            // Gender = s.Gender
        }).FirstOrDefaultAsync(x => x.Id == parsedUserId);
        return candidateDetails!;
    }

    public async Task SubmitCandidateAnswer(CandidateAnswer candidateAnswer)
    {

        await context.CandidateAnswers.AddAsync(candidateAnswer);

    }

    public async Task SubmitCandidateSnapshot(CandidateSnapshot candidateSnapshot)
    {

        await context.CandidateSnapshots.AddAsync(candidateSnapshot);

    }

    public async Task<QuestionDto> RetrieveQuestionDetails(int questionId)
    {
        var questionDetails = await context.AssessmentQuestions
            .Include(a => a.AssessmentAnswers)
            .Select(x => new QuestionDto()
            {
            Id = x.Id,

            Answers = x.AssessmentAnswers.Select(answer => new AssessmentAnswer()
            {
            Id = answer.Id,
            AnswerBody = answer.AnswerBody,
            QuestionId = answer.QuestionId,
            }).First(a => a.QuestionId == questionId)

            }).FirstOrDefaultAsync(x => x.Id == questionId);

    return questionDetails!;
    }

    public async Task SubmitAssessmentRemainingTime(AssessmentRemainingTimer assessmentRemainingTimer)
    {

        await context.AssessmentRemainingTimers.AddAsync(assessmentRemainingTimer);

    }

    public async Task SubmitAssessmentCorrection(AssessmentCorrection assessmentCorrection)
    {
        await context.AssessmentCorrections.AddAsync(assessmentCorrection);

    }

    public async Task UpdateAssessmentRemainingTime(int id, int remainingTimer)
    {
        try
        {
            var assessmentRemainingTimerData = await context.AssessmentRemainingTimers.FindAsync(id);

            if (assessmentRemainingTimerData != null) assessmentRemainingTimerData.RemainingTime = remainingTimer;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    public async Task<AnswerDto> RetrieveAnswerDetails(int answerId)
    {
        var answerDetails = await context.CandidateAnswers
            .Where(x=> x.Id == answerId)
            .Select(x => new AnswerDto()
            {
                AnswerId = x.Id,
                VideoName = x.AssessmentAnswerBody,
                CandidateId = x.CandidateId

            }).FirstOrDefaultAsync();

        return answerDetails!;
    }

}