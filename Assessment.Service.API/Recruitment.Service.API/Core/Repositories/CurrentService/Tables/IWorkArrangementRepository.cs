using Recruitment.Service.API.Core.Models.CurrentService.Dtos;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;

namespace Recruitment.Service.API.Persistence.Repositories.CurrentService.Tables;

public interface IWorkArrangementRepository
{
    Task<List<DropDownValueDto>> SelectWorkArrangementDropDown();
}