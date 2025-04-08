
using Assessment.Service.API.Core.Repositories.CurrentService.Tables;
using HRSolutionDbLibrary.Core.Entities.Tables;
using HRSolutionDbLibrary.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure.Internal;

namespace Assessment.Service.API.Persistence.EntityConfigurations.CurrentService.Tables
{
	public class CandidateCredentialRepository(CurrentServiceDbContext context) : ICandidateCredentialRepository
	{
		public async Task<CandidateCredential> AuthenticateAsync(string email)
		{

			try
			{
				var candidate = await context.CandidateCredentials
					.OrderByDescending(o=> o.Id)
					.FirstOrDefaultAsync(x => x.IsActive && x.Email == email);

				return candidate!;
			}
			catch (Exception e)
			{
				Console.WriteLine(e);
				throw;
			}

		}
		public async Task SetDefaultLogInAttempts(int id)
		{
			try
			{
				var candidate = await context.CandidateCredentials.FindAsync(id);

				if (candidate != null) candidate.LogInAttempt = 0;
			}
			catch (Exception e)
			{
				Console.WriteLine(e);
				throw;
			}
		}

		public async Task SetLogInAttempts(int id)
		{
			try
			{
				var candidate = await context.CandidateCredentials.FindAsync(id);

				if (candidate != null) candidate.LogInAttempt += 1;
			}
			catch (Exception e)
			{
				Console.WriteLine(e);
				throw;
			}
		}

		public async Task UpdateAssessmentIsStartedStatus(CandidateCredential candidateCredential)
		{
			try
			{
				var candidateCredentialData = await context.CandidateCredentials.FindAsync(candidateCredential.Id);

				if (candidateCredentialData != null) candidateCredentialData.IsAssessmentStarted = candidateCredential.IsAssessmentStarted;
			}
			catch (Exception e)
			{
				Console.WriteLine(e);
				throw;
			}
		}

		public async Task UpdateAssessmentIsFinishedStatus(CandidateCredential candidateCredential)
		{
			try
			{
				var candidateCredentialData = await context.CandidateCredentials.FindAsync(candidateCredential.Id);

				if (candidateCredentialData != null) candidateCredentialData.IsAssessmentFinished = candidateCredential.IsAssessmentFinished;
			}
			catch (Exception e)
			{
				Console.WriteLine(e);
				throw;
			}
		}

		public async Task SaveHistoryItem(CandidateHistory candidateHistory)
		{
			await context.CandidateHistories.AddAsync(candidateHistory);
		}

		public async Task SubmitAssessmentDetails(CandidateCredential candidateCredential)
		{
			try
			{
				var candidateCredentialData = await context.CandidateCredentials.FindAsync(candidateCredential.Id);

				if (candidateCredentialData != null)
				{
					candidateCredentialData.IsFullscreenExit = candidateCredential.IsFullscreenExit;
					candidateCredentialData.IsMouseExited = candidateCredential.IsMouseExited;
				}
			}
			catch (Exception e)
			{
				Console.WriteLine(e);
				throw;
			}
		}

		public async Task SetAssessmentMouseOut(CandidateCredential candidateCredential)
		{
			try
			{
				var candidateCredentialData = await context.CandidateCredentials.FindAsync(candidateCredential.Id);

				if (candidateCredentialData != null)
				{
					candidateCredentialData.MouseOutsideCounter = candidateCredential.MouseOutsideCounter;
				}
			}
			catch (Exception e)
			{
				Console.WriteLine(e);
				throw;
			}
		}

		public async Task SetCurrentAssessmentId(CandidateCredential candidateCredential)
		{
			try
			{
				var candidateCredentialData = await context.CandidateCredentials.FindAsync(candidateCredential.Id);

				if (candidateCredentialData != null)
				{
					candidateCredentialData.CurrentAssessmentId = candidateCredential.CurrentAssessmentId;
				}
			}
			catch (Exception e)
			{
				Console.WriteLine(e);
				throw;
			}
		}


		public async Task UpdateAssessmentRemainingTimerId(int id, int remainingTimerId)
		{
			try
			{
				var candidateCredentialData = await context.CandidateCredentials.FindAsync(id);

				if (candidateCredentialData != null) candidateCredentialData.AssessmentTimerId = remainingTimerId;
			}
			catch (Exception e)
			{
				Console.WriteLine(e);
				throw;
			}
		}
		

	}
}

