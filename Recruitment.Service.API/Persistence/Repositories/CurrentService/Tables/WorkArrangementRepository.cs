using HRSolutionDbLibrary.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;

namespace Recruitment.Service.API.Persistence.Repositories.CurrentService.Tables
{
    public class WorkArrangementRepository(CurrentServiceDbContext context) : IWorkArrangementRepository
    {
        public async Task<List<DropDownValueDto>> SelectWorkArrangementDropDown()
        {
            var jobStatuses = await context.WorkArrangements
                .Where(x => x.IsActive)
                .Select(s => new DropDownValueDto()
                {
                    Id = s.Id,
                    Value = s.Id.ToString(),
                    Label = s.Arrangement
                })
                .ToListAsync();

            return jobStatuses;

        }
    }
}
