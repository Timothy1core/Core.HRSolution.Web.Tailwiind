using Recruitment.Service.API.Core.Models.CurrentService.Dtos.ApplicationProcess;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;

namespace Recruitment.Service.API.Core.Repositories.CurrentService.Tables;

public interface IApplicationProcessRepository
{
    Task<List<ApplicationProcessDto>> SelectApplicationProcess();

    Task<List<DropDownValueDto>> SelectApplicationProcessDropDown();
}