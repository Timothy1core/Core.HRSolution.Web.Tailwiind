using HRSolutionDbLibrary.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;
using Recruitment.Service.API.Core.Repositories.CurrentService.Tables;

namespace Recruitment.Service.API.Persistence.Repositories.CurrentService.Tables
{
	public class DepartmentIndustryRepository(HrisDbContext context) : IDepartmentIndustryRepository
	{
		public async Task<List<DropDownValueDto>> SelectDepartmentIndustry()
		{
			var departments = await context.DepartmentIndustries
				.Where(x => x.IsActive)
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
