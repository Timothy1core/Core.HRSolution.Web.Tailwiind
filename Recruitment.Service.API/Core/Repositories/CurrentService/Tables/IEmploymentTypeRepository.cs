using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;

namespace Recruitment.Service.API.Core.Repositories.CurrentService.Tables;

public interface IEmploymentTypeRepository
{
    Task<List<DropDownValueDto>> SelectCoreServiceDropDown();
}