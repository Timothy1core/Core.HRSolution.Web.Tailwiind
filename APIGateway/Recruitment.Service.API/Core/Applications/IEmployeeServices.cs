using Microsoft.AspNetCore.Mvc;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.JobOffer;

namespace Recruitment.Service.API.Core.Applications
{
	public interface IEmployeeServices
	{
		Task<JsonResult> SaveEmployeeInformationService(int candidateId);
	}
}
