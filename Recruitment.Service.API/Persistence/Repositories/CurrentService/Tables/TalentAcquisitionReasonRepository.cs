using HRSolutionDbLibrary.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;
using Recruitment.Service.API.Core.Repositories.CurrentService.Tables;

namespace Recruitment.Service.API.Persistence.Repositories.CurrentService.Tables
{
    public class TalentAcquisitionReasonRepository(CurrentServiceDbContext context) : ITalentAcquisitionReasonRepository
    {
        public async Task<List<DropDownValueDto>> SelectTalentAcquisitionReasonDropDown()
        {
            var jobStatuses = await context.TalentAcquisitionReasons
                .Where(x => x.IsActive)
                .Select(s => new DropDownValueDto()
                {
                    Id = s.Id,
                    Value = s.Id.ToString(),
                    Label = s.Reason
                })
                .ToListAsync();

            return jobStatuses;

        }
    }
}
