using HRSolutionDbLibrary.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;
using Recruitment.Service.API.Core.Repositories.CurrentService.Tables;

namespace Recruitment.Service.API.Persistence.Repositories.CurrentService.Tables
{
    public class EmploymentTypeRepository(CurrentServiceDbContext context) : IEmploymentTypeRepository
    {
        public async Task<List<DropDownValueDto>> SelectCoreServiceDropDown()
        {
            var employmentTypes = await context.EmploymentTypes
                .Where(x => x.IsActive)
                .Select(s => new DropDownValueDto()
                {
                    Id = s.Id,
                    Value = s.Id.ToString(),
                    Label = s.TypeName
                })
                .ToListAsync();

            return employmentTypes;

        }
    }
}
