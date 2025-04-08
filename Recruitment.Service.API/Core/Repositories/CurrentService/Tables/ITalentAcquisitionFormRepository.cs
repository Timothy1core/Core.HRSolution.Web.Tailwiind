using Recruitment.Service.API.Core.Models.CurrentService.Dtos;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.TalentAcquisitionForm;

namespace Recruitment.Service.API.Core.Repositories.CurrentService.Tables;

public interface ITalentAcquisitionFormRepository
{
	Task CreateTalentAcquisitionForm(TalentAcquisitionForm taf);
	Task<TalentAcquisitionForm> SelectTalentAcquisitionFormInfo(int id);
	Task<List<TalentAcquisitionFormDashboardDto>> SelectTalentAcquisitionFormDashboard(int group, int client, int status, int reason);

	Task<List<DropDownValueDto>> SelectTalentAcquisitionFormDropDown(int departmentId);

	Task UpdateTalentAcquisitionForm(TalentAcquisitionForm taf);
}