namespace Recruitment.Service.API.Core.Helpers;

public interface IJobProfileHelper
{
	Task GenerateJobProfilePdfAsync(JobProfile jobProfile);
}