using Recruitment.Service.API.Core.Models.CurrentService.Dtos;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;

namespace Recruitment.Service.API.Core.Repositories.CurrentService.Tables;

public interface ITalentAcquisitionStatusRepository
{
    Task<List<DropDownValueDto>> SelectTalentAcquisitionStatusDropDown();
}