using Microsoft.AspNetCore.Mvc;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.TalentAcquisitionForm;

namespace Recruitment.Service.API.Core.Applications;

public interface ITalentAcquisitionFormServices
{
	Task<JsonResult> RetrieveTAFStatusDropDown();
	Task<JsonResult> RetrieveTAFReasonDropDown();
	Task<JsonResult> RetrieveWorkArrangementDropDown();
	Task<JsonResult> RetrieveTAFDropDown(int clientId);


	Task<JsonResult> CreateTalentAcquisitionForm(TalentAcquisitionFormRequestDto tafRequest, string loggedEmployee);
	Task<JsonResult> UpdateTalentAcquisitionForm(TalentAcquisitionFormRequestDto tafRequest, string loggedEmployee);

	Task<JsonResult> SelectTalentAcquisitionFormDetail(int id);
	Task<JsonResult> RetrieveTalentAcquisitionFormDashboard(int group, int client, int status, int reason, string? search, int start, int length, string draw, string sortColumnName, string sortDirection);
	Task<JsonResult> SendTalentAcquisitionForm(TalentAcquisitionFormBatchDto batchDto, string loggedEmployee);

	Task<JsonResult> SelectTalentAcquisitionForm(int id);

	Task<JsonResult> SaveClientAcknowledgment(TalentAcquisitionClientAcknowledgmentDto requestDto);
}