using HRSolutionDbLibrary.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;
using Recruitment.Service.API.Core.Repositories.CurrentService.Tables;

namespace Recruitment.Service.API.Persistence.Repositories.CurrentService.Tables
{
	public class DepartmentGroupRepository(CurrentServiceDbContext context) : IDepartmentGroupRepository
	{
		public async Task<List<DropDownValueDto>> SelectClientCompanyGroup()
		{
			var departments = await context.DepartmentGroups
				.Select(s => new DropDownValueDto()
				{
					Id = s.Id,
					Value = s.Id.ToString(),
					Label = s.GroupName
				}).ToListAsync();

			return departments;
		}
	}
}
