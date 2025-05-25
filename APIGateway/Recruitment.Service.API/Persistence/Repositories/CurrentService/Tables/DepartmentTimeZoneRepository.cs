using HRSolutionDbLibrary.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;
using Recruitment.Service.API.Core.Repositories.CurrentService.Tables;

namespace Recruitment.Service.API.Persistence.Repositories.CurrentService.Tables
{
	public class DepartmentTimeZoneRepository(HrisDbContext context) : IDepartmentTimeZoneRepository
	{
		public async Task<List<DropDownValueDto>> SelectDepartmentTimeZoneDropDown()
		{
			var departments = await context.DepartmentTimeZones
				.Where(x => x.IsActived)
				.Select(s => new DropDownValueDto()
				{
					Id = s.Id,
					Value = s.Id.ToString(),
					Label = s.Name
				})
				.ToListAsync();

			return departments;

		}
	}
}
