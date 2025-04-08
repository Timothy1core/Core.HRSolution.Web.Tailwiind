using HRSolutionDbLibrary.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.ApplicationProcess;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;
using Recruitment.Service.API.Core.Repositories.CurrentService.Tables;

namespace Recruitment.Service.API.Persistence.Repositories.CurrentService.Tables
{
	public class ApplicationProcessRepository (CurrentServiceDbContext context) : IApplicationProcessRepository
	{
		public async Task<List<ApplicationProcessDto>> SelectApplicationProcess()
		{
			var process = await context.ApplicationProcesses
				.Where(w=> w.IsActive==true)
				.Select(s => new ApplicationProcessDto()
				{
					Id = s.Id,
					ProcessName = s.ProcessName,
					SequenceOrder = s.SequenceOrder
				}).ToListAsync();
			return process;
		}

		public async Task<List<DropDownValueDto>> SelectApplicationProcessDropDown()
		{
			var profiles = await context.ApplicationProcesses
				.Where(w => w.IsActive == true)
				.ToListAsync();


			var dropDownValueDtos = profiles.Select(s => new DropDownValueDto()
			{
				Id = s.Id,
				Value = s.Id.ToString(),
				Label = s.ProcessName
			}).ToList();

			return dropDownValueDtos;

		}
	}
}
