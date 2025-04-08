using HRSolutionDbLibrary.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;
using Recruitment.Service.API.Core.Repositories.CurrentService.Tables;

namespace Recruitment.Service.API.Persistence.Repositories.CurrentService.Tables
{
    public class JobStatusRepository(CurrentServiceDbContext context) : IJobStatusRepository
    {
        public async Task<List<DropDownValueDto>> SelectJobStatusDropDown()
        {
            var jobStatuses = await context.JobStatuses
                .Where(x => x.IsActive)
                .Select(s => new DropDownValueDto()
                {
                    Id = s.Id,
                    Value = s.Id.ToString(),
                    Label = s.Status
                })
                .ToListAsync();

            return jobStatuses;

        }
    }
}
