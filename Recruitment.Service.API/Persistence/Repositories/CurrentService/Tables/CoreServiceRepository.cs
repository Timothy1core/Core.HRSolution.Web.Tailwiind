using HRSolutionDbLibrary.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;
using Recruitment.Service.API.Core.Repositories.CurrentService.Tables;

namespace Recruitment.Service.API.Persistence.Repositories.CurrentService.Tables
{
    public class CoreServiceRepository(CurrentServiceDbContext context) : ICoreServiceRepository
	{
		public async Task<List<DropDownValueDto>> SelectCoreServiceDropDown()
		{
			var coreServices = await context.CoreServices
				.Where(x => x.IsActive)
				.Select(s=> new DropDownValueDto()
				{
					Id = s.Id,
					Value = s.Id.ToString(),
					Label = s.Service
				})
				.ToListAsync();

			return coreServices;

		}
	}
}
