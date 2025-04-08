using HRSolutionDbLibrary.Core.Entities.Tables;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.TalentAcquisitionForm;

namespace Recruitment.Service.API.Core.Repositories.CurrentService.Tables;

public interface ITalentAcquisitionFormBatchRepository
{
	Task CreateTalentAcquisitionFormBatch(TalentAcquisitionFormBatch batch, List<int> tafId);
	Task<TalentAcquisitionFormBatch> SelectTalentAcquisitionFormBatchInfo(int id);

	Task SaveAcknowledgement(TalentAcquisitionClientAcknowledgmentDto acknowledgmentDto);
}