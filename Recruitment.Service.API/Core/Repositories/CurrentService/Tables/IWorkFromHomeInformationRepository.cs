namespace Recruitment.Service.API.Core.Repositories.CurrentService.Tables
{
	public interface IWorkFromHomeInformationRepository
	{
		Task SaveWorkFromHomeInformation(WorkFromHomeInformation workFromHomeInformation);
		Task<WorkFromHomeInformation> RetrieveWorkFromHomeInformation(int candidateId);
		Task UpdateWorkFromHomeInformation(WorkFromHomeInformation workFromHomeInformationDto);
		Task WorkFromHomeInformationHrApproved(WorkFromHomeInformation workFromHomeInformationDto);
		Task WorkFromHomeInformationITApproved(WorkFromHomeInformation workFromHomeInformationDto);
	}
}
