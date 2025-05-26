using HRSolutionDbLibrary.Core.Entities.hris.Tables;

namespace Recruitment.Service.API.Core.Helpers;

public interface IJobProfileHelper
{
	Task GenerateJobProfilePdfAsync(JobProfile jobProfile);
}