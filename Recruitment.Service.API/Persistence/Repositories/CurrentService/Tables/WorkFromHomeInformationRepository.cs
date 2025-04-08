using HRSolutionDbLibrary.Core.Entities.Tables;
using HRSolutionDbLibrary.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Onboarding;
using Recruitment.Service.API.Core.Repositories.CurrentService.Tables;

namespace Recruitment.Service.API.Persistence.Repositories.CurrentService.Tables
{
	public class WorkFromHomeInformationRepository(CurrentServiceDbContext context) : IWorkFromHomeInformationRepository
	{
		public async Task SaveWorkFromHomeInformation(WorkFromHomeInformation workFromHomeInformation)
		{
			await context.WorkFromHomeInformations.AddAsync(workFromHomeInformation);
		}

		public async Task<WorkFromHomeInformation> RetrieveWorkFromHomeInformation(int candidateId)
		{
			var workFromHomeInfo = await context.WorkFromHomeInformations
				.Include(x => x.Candidate)
				.ThenInclude(i => i.Job)
				.Where(w => w.CandidateId == candidateId)
				.Select(s => new WorkFromHomeInformation
				{
					CandidateId = s.CandidateId,
					WorkLocation = s.WorkLocation,
					PinLocation = s.PinLocation,
					InternetProvider = s.InternetProvider,
					InternetService = s.InternetService,
					UploadInternetSpeed = s.UploadInternetSpeed,
					DownloadInternetSpeed = s.DownloadInternetSpeed,
					PlatformVideoCall = s.PlatformVideoCall,
					MessengerAccount = s.MessengerAccount,
					AvailabilityCall = s.AvailabilityCall,
					SetUpWorkStation1 = s.SetUpWorkStation1,
					SetUpWorkStation2 = s.SetUpWorkStation2,
					SetUpWorkStation3 = s.SetUpWorkStation3,
					SetUpWorkStation4 = s.SetUpWorkStation4,
					SetUpWorkStation5 = s.SetUpWorkStation5,
					SetUpWorkStation6 = s.SetUpWorkStation6,
					SurroundAreas1 = s.SurroundAreas1,
					SurroundAreas2 = s.SurroundAreas2,
					SurroundAreas3 = s.SurroundAreas3,
					SurroundAreas4 = s.SurroundAreas4,
					SurroundAreas5 = s.SurroundAreas5,
					SurroundAreas6 = s.SurroundAreas6,
					SurroundAreas7 = s.SurroundAreas7,
					SurroundAreas8 = s.SurroundAreas8,
					SurroundAreas9 = s.SurroundAreas9,
					SurroundAreas10 = s.SurroundAreas10,
					WorkFromHomeApproval = s.WorkFromHomeApproval,
					WorkFromHomeApprovalBy = s.WorkFromHomeApprovalBy,
					WorkFromHomeApproval1 = s.WorkFromHomeApproval1,
					WorkFromHomeApprovalBy1 = s.WorkFromHomeApprovalBy1,
				})
				.FirstOrDefaultAsync();
			return workFromHomeInfo!;
		}

		public async Task UpdateWorkFromHomeInformation(WorkFromHomeInformation workFromHomeInformationDto)
		{
			var workFromHomeInformation = await context.WorkFromHomeInformations.FirstOrDefaultAsync(x => x.CandidateId == workFromHomeInformationDto.CandidateId);

			if (workFromHomeInformation != null)
			{
				workFromHomeInformation.CandidateId = workFromHomeInformationDto.CandidateId;
				workFromHomeInformation.WorkLocation = workFromHomeInformationDto.WorkLocation;
				workFromHomeInformation.PinLocation = workFromHomeInformationDto.PinLocation;
				workFromHomeInformation.InternetProvider = workFromHomeInformationDto.InternetProvider;
				workFromHomeInformation.InternetService = workFromHomeInformationDto.InternetService;
				workFromHomeInformation.UploadInternetSpeed = workFromHomeInformationDto.UploadInternetSpeed;
				workFromHomeInformation.DownloadInternetSpeed = workFromHomeInformationDto.DownloadInternetSpeed;
				workFromHomeInformation.PlatformVideoCall = workFromHomeInformationDto.PlatformVideoCall;
				workFromHomeInformation.MessengerAccount = workFromHomeInformationDto.MessengerAccount;
				workFromHomeInformation.AvailabilityCall = workFromHomeInformationDto.AvailabilityCall;
				workFromHomeInformation.SetUpWorkStation1 = workFromHomeInformationDto.SetUpWorkStation1;
				workFromHomeInformation.SetUpWorkStation2 = workFromHomeInformationDto.SetUpWorkStation2;
				workFromHomeInformation.SetUpWorkStation3 = workFromHomeInformationDto.SetUpWorkStation3;
				workFromHomeInformation.SetUpWorkStation4 = workFromHomeInformationDto.SetUpWorkStation4;
				workFromHomeInformation.SetUpWorkStation5 = workFromHomeInformationDto.SetUpWorkStation5;
				workFromHomeInformation.SetUpWorkStation6 = workFromHomeInformationDto.SetUpWorkStation6;
				workFromHomeInformation.SurroundAreas1 = workFromHomeInformationDto.SurroundAreas1;
				workFromHomeInformation.SurroundAreas2 = workFromHomeInformationDto.SurroundAreas2;
				workFromHomeInformation.SurroundAreas3 = workFromHomeInformationDto.SurroundAreas3;
				workFromHomeInformation.SurroundAreas4 = workFromHomeInformationDto.SurroundAreas4;
				workFromHomeInformation.SurroundAreas5 = workFromHomeInformationDto.SurroundAreas5;
				workFromHomeInformation.SurroundAreas6 = workFromHomeInformationDto.SurroundAreas6;
				workFromHomeInformation.SurroundAreas7 = workFromHomeInformationDto.SurroundAreas7;
				workFromHomeInformation.SurroundAreas8 = workFromHomeInformationDto.SurroundAreas8;
				workFromHomeInformation.SurroundAreas9 = workFromHomeInformationDto.SurroundAreas9;
				workFromHomeInformation.SurroundAreas10 = workFromHomeInformationDto.SurroundAreas10;
				workFromHomeInformation.WorkFromHomeApproval = workFromHomeInformationDto.WorkFromHomeApproval;
				workFromHomeInformation.WorkFromHomeApprovalBy = workFromHomeInformationDto.WorkFromHomeApprovalBy;
				workFromHomeInformation.WorkFromHomeApproval1 = workFromHomeInformationDto.WorkFromHomeApproval1;
				workFromHomeInformation.WorkFromHomeApprovalBy1 = workFromHomeInformationDto.WorkFromHomeApprovalBy1;
			}
		}

		public async Task WorkFromHomeInformationHrApproved(WorkFromHomeInformation workFromHomeInformationDto)
		{
			var workFromHomeInformation = await context.WorkFromHomeInformations.FirstOrDefaultAsync(x => x.CandidateId == workFromHomeInformationDto.CandidateId);

			if (workFromHomeInformation != null)
			{
				workFromHomeInformation.WorkFromHomeApproval = true;
				workFromHomeInformation.WorkFromHomeApprovalBy = workFromHomeInformationDto.WorkFromHomeApprovalBy;
			}
		}

		public async Task WorkFromHomeInformationITApproved(WorkFromHomeInformation workFromHomeInformationDto)
		{
			var workFromHomeInformation = await context.WorkFromHomeInformations.FirstOrDefaultAsync(x => x.CandidateId == workFromHomeInformationDto.CandidateId);

			if (workFromHomeInformation != null)
			{
				workFromHomeInformation.WorkFromHomeApproval1 = true;
				workFromHomeInformation.WorkFromHomeApprovalBy1 = workFromHomeInformationDto.WorkFromHomeApprovalBy1;
			}
		}
	}
}
