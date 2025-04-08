using HRSolutionDbLibrary.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;
using Recruitment.Service.API.Core.Repositories.CurrentService.Tables;

namespace Recruitment.Service.API.Persistence.Repositories.CurrentService.Tables
{
	public class DepartmentStatusRepository(CurrentServiceDbContext context) : IDepartmentStatusRepository
	{
		public async Task<List<DropDownValueDto>> SelectDepartmentStatusDropDown()
		{
			var coreServices = await context.DepartmentStatuses
				.Where(x => x.IsActive)
				.Select(s => new DropDownValueDto()
				{
					Id = s.Id,
					Value = s.Id.ToString(),
					Label = s.Status
				})
				.ToListAsync();

			return coreServices;

		}
	}
}
