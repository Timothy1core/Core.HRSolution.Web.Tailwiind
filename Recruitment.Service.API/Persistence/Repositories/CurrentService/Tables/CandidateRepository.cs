using HRSolutionDbLibrary.Core.Entities.Tables;
using HRSolutionDbLibrary.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Candidate;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.JobProfile;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Pipeline;
using Recruitment.Service.API.Core.Repositories.CurrentService.Tables;
using Spire.Doc.Fields.Shapes;
using JobAssessmentDto = Recruitment.Service.API.Core.Models.CurrentService.Dtos.Candidate.JobAssessmentDto;

namespace Recruitment.Service.API.Persistence.Repositories.CurrentService.Tables
{
    public class CandidateRepository(CurrentServiceDbContext context) : ICandidateRepository
    {
        public async Task SaveApplicationForm(Candidate candidate)
        {
            await context.Candidates.AddAsync(candidate);
        }

        public async Task<List<CandidateDto>> RetrieveCandidateList()
        {
            var candidates = await context.Candidates
                .Include(x => x.Job)
                .ThenInclude(x=>x.JobApplicationProcesses)
                .ThenInclude(c => c.ApplicationProcess)
                .Where( x => x.IsActive == true)
                .Select(s => new CandidateDto()
                {
                    Id = s.Id,
                    FirstName = s.FirstName,
                    LastName = s.LastName,
                    Email = s.Email,
                    PhoneNumber = s.PhoneNumber,
                    NoticePeriod = s.NoticePeriod,
                    ExpectedSalary = s.ExpectedSalary,
                    CurrentSalary = s.CurrentSalary,
                    ApplicationStatusId = s.ApplicationStatusId,
                    JobId = s.JobId,
                    JobName = s.Job.Position,
                    IsDisqualified = s.IsDisqualified,
                    SourceId = s.SourceId,
                    ClientCompanyId = s.Job.DepartmentId,
                    ClientGroupId = s.Job.Department.DepartmentGroupId,
                    SourceName = s.Source.SourceName,
                    StageName = s.Job.JobApplicationProcesses.Where(x=>x.ApplicationProcessId == s.ApplicationStatusId).Select(x=>x.ApplicationProcess.ProcessName).FirstOrDefault()
                    // IsActive = s.IsActive
                })
                .ToListAsync();
            return candidates;

        }

		public async Task<List<PipelineDto>> RetrievePipelineList()
		{
			var pipelineData = await context.CandidateHistories
				.GroupBy(s =>
					s.Name == "Applied" || s.Name == "Sourced" ? "Applied & Sourced" : s.Name
				)
				.Select(g => new PipelineDto()
				{
					ProcessName = g.Key,
					ProcessCount = g.Count(),
					// Rate = "", // Placeholder for now
					LeftNote = g.Key == "Applied & Sourced" ? "Workable, Jobstreet, Indeed, Kalibr, System Applications & Active Sourced from LinkedIn"
						: g.Key == "Initial Interview" ? "Total Processed"
						: g.Key == "Assessment" ? "Total Processed"
						: g.Key == "Final Interview" ? "Total Processed"
						: g.Key == "Offer" ? "Total Processed"
						: null,
					RightNote = g.Key == "Assessment" ? "Candidates successfully given the assessments"
						: g.Key == "Final Interview" ? "Candidates successfully endorsed for final interview"
						: g.Key == "Offer" ? "Candidates successfully given the assessments"
						: null
				})
				.ToListAsync();

			return pipelineData;
		}

		public async Task<CandidateDto> RetrieveCandidateInfo(int candidateId)
        {
            var candidate = await context.Candidates
                .Include(x => x.JobApplicationAnswers)
                .Include(j => j.CandidateCredentials)
                .Include(i=>i.Source)
                .Where(x => x.Id == candidateId)
                .Select(s => new CandidateDto()
                {
                    Id = s.Id,
                    FirstName = s.FirstName,
                    LastName = s.LastName,
                    Email = s.Email,
                    PhoneNumber = s.PhoneNumber,
                    NoticePeriod = s.NoticePeriod,
                    ExpectedSalary = s.ExpectedSalary,
                    CurrentSalary = s.CurrentSalary,
                    JobId = s.JobId,
                    ClientId = s.Job.DepartmentId,
                    JobName = s.Job.Position,
                    Resume = s.Resume,
                    SourceId = s.SourceId,
                    SourceName = s.Source.SourceName,
                    ApplicationStatusId = s.ApplicationStatusId,
                    IsDisqualified = s.IsDisqualified,
                    IsActive = s.IsActive,
                    StageName = s.Job.JobApplicationProcesses.Where(x => x.ApplicationProcessId == s.ApplicationStatusId).Select(x => x.ApplicationProcess.ProcessName).FirstOrDefault(),
                    CurrentEmploymentStatus = s.CurrentEmploymentStatus,
                    CandidateCredentials = s.CandidateCredentials.Select(x => new CandidateCredential()
                    {
                        IsAssessmentFinished = x.IsAssessmentFinished,
                    }).FirstOrDefault(),
                    JobApplicationAnswers = s.JobApplicationAnswers.Select(x => new JobApplicationAnswer()
                    {
                    Id = x.Id,
                    Answer = x.Answer,
                    ApplicationQuestionId = x.ApplicationQuestionId
                    }).ToList()
                //    JobApplicationAnswers = s.JobApplicationAnswers.Select(x => new JobApplicationAnswer()
                //    {
                //    Id = x.Id,
                //    Answer = x.Answer,
                //}).ToList()
                })
                .FirstOrDefaultAsync();

            return candidate!;

        }

        public async Task<List<CandidateHistoryDto>> RetrieveCandidateHistory(int candidateId)
        {
            var candidate = await context.CandidateHistories
	            //.Include(i=>i.CreatedByInfo)
                .Where(x => x.CandidateId == candidateId)
                .Select(s => new CandidateHistoryDto()
                {
                    Id = s.Id,
                    Name = s.Name,
                    Type = s.Type,
                    Description = s.Description,
                    CreatedDate = s.CreatedDate,
                    CreatedBy = s.CreatedBy == null ? "null" : s.CreatedBy,
                    CandidateId = s.CandidateId,
                    //CreatedByName = s.CreatedByInfo.FirstName + " " + s.CreatedByInfo.LastName,
				})
                .ToListAsync();

            return candidate!;

        }
        public async Task<List<JobAssessmentDto>> RetrieveCandidateAssessmentDetails(int jobId, int candidateId)
        {
            var assessmentDetails = await context.JobAssessments
                    .Where(x => x.JobId == jobId && x.AssessmentId != null)
                    .Include(x => x.Assessment)
                    .ThenInclude(x => x.AssessmentCorrections)
                    .Select(a => new JobAssessmentDto()
                    {
                        Id = a.Id,
                        JobId = jobId,
                        AssessmentDetails = a.Assessment.AssessmentCorrections
                            .Where(c => c.CandidateId == candidateId)
                            
                            .Select(c => new AssessmentCorrectionDto()
                            {
                                Id = c.Id,
                                AssessmentId = c.AssessmentId,
                                QuestionId = c.QuestionId,
                                CandidateId = c.CandidateId,
                                AnswerBody = c.AnswerBody,
                                IsCorrect = c.IsCorrect,
                                Marks = c.Marks
                            }).ToList(),
                        AssessmentName = a.Assessment.Name,
                        CorrectCount = a.Assessment.AssessmentCorrections
                            .Where(c => c.IsCorrect == true && c.CandidateId == candidateId)
                            .Select(c => new AssessmentCorrectionDto()
                            {
                                Id = c.Id,
                            }).Count(),
                        WrongCount = a.Assessment.AssessmentCorrections
                            .Where(c => c.IsCorrect == false && c.CandidateId == candidateId)
                            .Select(c => new AssessmentCorrectionDto()
                            {
                                Id = c.Id,
                            }).Count(),
                        NeedToCheck = a.Assessment.AssessmentCorrections
                            .Where(c => c.IsMultipleChoice == false && c.CandidateId == candidateId)
                            .Select(c => new AssessmentCorrectionDto()
                            {
                                Id = c.Id,
                            }).Count(),
                        TotalQuestions = a.Assessment.AssessmentCorrections
                            .Where(c => c.CandidateId == candidateId)
                            .Select(c => new AssessmentCorrectionDto()
                            {
                                Id = c.Id,
                            }).Count(),
                    }).ToListAsync();

            return assessmentDetails;
        }

        public async Task<List<CandidateAssessmentDetailsDto>> RetrieveCandidateAssessmentAllDetails(int jobId,
	        int candidateId)
        {
	        var candidateAssessmentDetails = await context.JobAssessments
		        .Where(x => x.JobId == jobId && x.AssessmentId != null)
		        .Include(x => x.Assessment)
		        .ThenInclude(x => x.AssessmentCorrections)
		        .Include(x => x.Assessment)
		        .ThenInclude(i => i.AssessmentQuestions)
		        .ThenInclude(i=>i.AssessmentAnswers)
				.Select(a => new CandidateAssessmentDetailsDto()
		        {
                    Id = a.Id,
                    AssessmentName = a.Assessment.Name,
					Questions = a.Assessment.AssessmentQuestions.Where(w=>w.IsActive == true).Select(q => new QuestionAndAnswerDetailsDto()
					{
                        QuestionId = q.Id,
                        QuestionBody =  q.Body,
                        CandidateAnswerBody = q.CandidateAnswers.Where(w => w.CandidateId == candidateId ).Select(ans => ans.AssessmentAnswerBody).FirstOrDefault(),
                        CorrectAnswerBody = q.AssessmentAnswers.Select(answer => answer.AnswerBody).FirstOrDefault(),
                        IsCorrect = a.Assessment.AssessmentCorrections.Where(w => w.CandidateId == candidateId && w.QuestionId ==q.Id).Select(c => c.IsCorrect).FirstOrDefault()
					}).ToList(),
		        }).ToListAsync();

	        return candidateAssessmentDetails;
        }

		public async Task SaveHistoryItem(CandidateHistory candidateHistory)
        {
            await context.CandidateHistories.AddAsync(candidateHistory);
        }

        public async Task<List<CandidateCommentDto>> RetrieveCandidateComment(int candidateId)
        {
            var candidate = await context.CandidateComments
	            .Include(i=>i.CreatedByInfo)
                .Where(x => x.CandidateId == candidateId)
                .Select(s => new CandidateCommentDto()
                {
                    Comment = s.Comment,
                    CreatedDate = s.CreatedDate,
                    CreatedBy = s.CreatedBy == null ? "null" : s.CreatedBy,
                    CandidateId = s.CandidateId,
                    CreatedByName = s.CreatedByInfo.FirstName + " " + s.CreatedByInfo.LastName,
				})
                .ToListAsync();

            return candidate!;

        }

        public async Task SaveCommentItem(CandidateComment candidateComment)
        {
            await context.CandidateComments.AddAsync(candidateComment);
        }
        public async Task<Candidate> SelectCandidateInformation(int candidateId)
        {
	        var candidate = await context.Candidates
		        .Include(i=> i.Job)
		        .FirstOrDefaultAsync(f=> f.Id== candidateId);

	        return candidate!;

        }

        public async Task CreateCandidateWriteUp(CandidateWriteUp candidateWriteUp)
        {
            await context.CandidateWriteUps.AddAsync(candidateWriteUp);
        }

        public async Task<List<CandidateWriteUpDto>> RetrieveWriteUpInfo(int candidateId)
        {
            var candidate = await context.CandidateWriteUps
                .Where(x => x.CandidateId == candidateId)
                .Include(c => c.Candidate)
                .Select(s => new CandidateWriteUpDto()
                {
                    Id = s.Id,
                    CandidateId = s.CandidateId,
                    ProfileOverview = s.ProfileOverview,
                    ProfessionalBackground = s.ProfessionalBackground,
                    Skills = s.Skills,
                    Behavioral = s.Behavioral,
                    Notes = s.Notes,
                })
                .ToListAsync();

            return candidate!;

        }

        public async Task UpdateWriteUp(int id, CandidateWriteUpRequestDto candidateWriteUpDto)
        {
            var candidateWriteUp = await context.CandidateWriteUps.FirstOrDefaultAsync(x => x.Id == id);

            if (candidateWriteUp != null)
            {
                candidateWriteUp.ProfileOverview = candidateWriteUpDto.ProfileOverview;
                candidateWriteUp.ProfessionalBackground = candidateWriteUpDto.ProfessionalBackground;
                candidateWriteUp.Skills = candidateWriteUpDto.Skills;
                candidateWriteUp.Behavioral = candidateWriteUpDto.Behavioral;
                candidateWriteUp.Notes = candidateWriteUpDto.Notes;
            }
        }

        public async Task UpdateStage(int id, int stageId)
        {
            var candidate = await context.Candidates.FirstOrDefaultAsync(x => x.Id == id);

            if (candidate != null)
            {
                candidate.ApplicationStatusId = stageId;
            }

        }

        public async Task UpdateJob(int id, int jobId,  int stageId)
        {
            var candidate = await context.Candidates.FirstOrDefaultAsync(x => x.Id == id);

            if (candidate != null)
            {
                candidate.JobId = jobId;
                candidate.ApplicationStatusId = stageId;
			}
        }


        public async Task RemovedCandidate(int id)
        {
            var candidate = await context.Candidates.FirstOrDefaultAsync(x => x.Id == id);

            if (candidate != null) candidate.IsActive = false;
        }

        public async Task DisqualifyCandidate(int id)
        {
            var candidate = await context.Candidates.FirstOrDefaultAsync(x => x.Id == id);

            if (candidate != null) candidate.IsDisqualified = true;
        }

        public async Task<AssessmentCheckingDto> RetrieveCandidateAssessmentCheckingDetails(int assessmentId, int candidateId)
        {
            var assessmentDetails = await context.Assessments
                .Include(i=>i.AssessmentQuestions)
                .ThenInclude(i=>i.AssessmentAnswers)
                .Include(i=>i.AssessmentCorrections)
                .Where(x => x.Id == assessmentId)
                .Select(a => new AssessmentCheckingDto()
            {
                Id = a.Id,
                Name = a.Name,
                QuestionDetails = a.AssessmentQuestions.Where(q=>q.Type != 1 && q.IsActive == true).Select(q=> new QuestionDetailsDto()
                {
                    Id = q.Id,
                    Body = q.Body,
                    Type = q.Type,
                    AnswerId = q.CandidateAnswers
                        .Where(ans => ans.CandidateId == candidateId && ans.QuestionId == q.Id)
                        .Select(ans => ans.Id).FirstOrDefault(),
                    Answer = q.CandidateAnswers
                        .Where(ans => ans.CandidateId == candidateId && ans.QuestionId == q.Id)
                        .Select(ans => ans.AssessmentAnswerBody).FirstOrDefault(),
                    Correction = a.AssessmentCorrections.Where(cor => cor.QuestionId == q.Id && cor.CandidateId == candidateId).Select(cor => cor.IsCorrect).FirstOrDefault(),
                    CorrectionId = a.AssessmentCorrections.Where(cor => cor.QuestionId == q.Id && cor.CandidateId == candidateId).Select(cor => cor.Id).FirstOrDefault()
                    // .Select(ans => ans.AssessmentAnswerBody).FirstOrDefault()
                }).ToList()
            }).FirstOrDefaultAsync();


            return assessmentDetails;
        }

        public async Task CreateCandidateCredential(CandidateCredential candidateCredential)
        {
            await context.CandidateCredentials.AddAsync(candidateCredential);
        }

        public async Task SetAssessmentCredentialInactive(int id)
        {
            var candidate = await context.CandidateCredentials.FirstOrDefaultAsync(x => x.CandidateId == id);

            if (candidate != null) candidate.IsActive = false;
        }

        public async Task<List<DropDownValueDto>> SelectSourceDropDown()
        {
            var sources = await context.Sources.Select(s => new DropDownValueDto()
                {
                    Id = s.Id,
                    Value = s.Id.ToString(),
                    Label = s.SourceName
                })
                .ToListAsync();

            return sources;
        }

        public async Task SubmitCandidateCorrection(int id, bool isCorrect)
        {
            var candidate = await context.AssessmentCorrections.FirstOrDefaultAsync(x => x.Id == id);

            if (candidate != null) candidate.IsCorrect = isCorrect;
        }

        public async Task RemoveCandidateCredential(int id)
        {
	        var candidate = await context.CandidateCredentials.FirstOrDefaultAsync(x => x.CandidateId == id);

	        if (candidate != null)
	        {
				context.CandidateCredentials.Remove(candidate);
				await context.SaveChangesAsync();
			}
        }

		#region JobOffer

		public async Task<List<CandidateDto>> RetrieveCandidateToOfferList()
		{
			var candidates = await context.Candidates
				.Include(x => x.Job)
				.ThenInclude(x => x.JobApplicationProcesses)
				.ThenInclude(c => c.ApplicationProcess)
				.Where(x => x.IsActive == true && x.ApplicationStatusId == 9)
				.Select(s => new CandidateDto()
				{
					Id = s.Id,
					FirstName = s.FirstName,
					LastName = s.LastName,
					Email = s.Email,
					PhoneNumber = s.PhoneNumber,
					NoticePeriod = s.NoticePeriod,
					ExpectedSalary = s.ExpectedSalary,
					CurrentSalary = s.CurrentSalary,
					ApplicationStatusId = s.ApplicationStatusId,
					JobId = s.JobId,
					JobName = s.Job.Position,
					IsDisqualified = s.IsDisqualified,
					SourceId = s.SourceId,
					ClientCompanyId = s.Job.DepartmentId,
					ClientGroupId = s.Job.Department.DepartmentGroupId,
					SourceName = s.Source.SourceName,
					StageName = s.Job.JobApplicationProcesses.Where(x => x.ApplicationProcessId == s.ApplicationStatusId).Select(x => x.ApplicationProcess.ProcessName).FirstOrDefault(),
				})
				.ToListAsync();
			return candidates;

		}

		#endregion

	}
}
