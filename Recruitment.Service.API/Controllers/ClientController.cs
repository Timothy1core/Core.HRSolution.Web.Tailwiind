using Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using FileServiceLibrary;
using Recruitment.Service.API.Core.Applications;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.ClientProfile;

namespace Recruitment.Service.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class ClientController(
		IClientServices clientServices,
		IFileService fileService

	) : ControllerBase
	{
		private readonly IClientServices _clientServices = clientServices;
		private readonly IFileService _fileService = fileService;

		[Authorize]
		[Permission("client.company.create")]
		[HttpPost("create_client_company")]
		public async Task<IActionResult> CreateClientCompany([FromForm] ClientCompanyRequestDto companyRequest)
		{
			var loggedEmployee = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

			var result = await _clientServices.CreateClientCompanyProfile(companyRequest, loggedEmployee);

			return result;
		}

		[Authorize]
		[Permission("client.company.retrieve.list")]
		[HttpGet("retrieve_dashboard_client_company")]
		public async Task<IActionResult> RetrieveDashboardClientCompany([FromQuery] int groupId, [FromQuery] int serviceId, [FromQuery] int statusId)
		{
			
			var result = await _clientServices.RetrieveClientCompanyProfileDashboard(groupId, serviceId, statusId);

			return result;
		}

		[Authorize]
		[Permission("client.company.retrieve.info")]
		[HttpGet("retrieve_client_company_profile/{id}")]
		public async Task<IActionResult> RetrieveClientCompanyProfile(int id)
		{

			var result = await _clientServices.RetrieveClientCompanyProfileInfo(id);

			return result;
		}


		[Authorize]
		[Permission("client.company.update")]
		[HttpPut("update_client_company/{id}")]
		public async Task<IActionResult> UpdateClientCompany(int id,[FromForm] ClientCompanyRequestDto companyRequest)
		{
			var result = await _clientServices.UpdateClientCompanyProfile(id, companyRequest);

			return result;
		}

		[Authorize]
		[Permission("client.individual.create")]
		[HttpPost("create_client_individual")]
		public async Task<IActionResult> CreateClientIndividual([FromForm] int companyId, [FromForm] List<ClientIndividualDto> individuals)
		{

			var result = await _clientServices.CreateClientIndividuals(companyId, individuals);

			return result;
		}


		[Authorize]
		[Permission("client.individual.retrieve")]
		[HttpGet("retrieve_client_individuals/{companyId}")]
		public async Task<IActionResult> RetrieveClientIndividuals(int companyId)
		{

			var result = await _clientServices.RetrieveClientIndividualDashboard(companyId);

			return result;
		}

		[Authorize]
		[Permission("client.individual.update")]
		[HttpPut("update_client_individual/{id}")]
		public async Task<IActionResult> UpdateClientIndividual(int id, [FromForm] ClientIndividualDto individuals)
		{

			var result = await _clientServices.UpdateClientIndividual(id, individuals);

			return result;
		}



		#region MyRegion

		[AllowAnonymous]
		[HttpGet("client_logo/{id}")]
		public async Task<IActionResult> ClientLogo(int id)
		{

			var logo = await _clientServices.RetrieveClientLogo(id);

			return PhysicalFile(logo.filePath, logo.contentType);
		}

		[Authorize]
		[HttpGet("core_services_dropdown_list")]
		public async Task<IActionResult> CoreServicesDropDownList()
		{
			var value = await _clientServices.RetrieveCoreServicesDropDown();
			return value;
		}

		[Authorize]
		[HttpGet("client_status_dropdown_list")]
		public async Task<IActionResult> ClientStatusDropDownList()
		{
			var value = await _clientServices.RetrieveClientStatusDropDown();
			return value;
		}

		[Authorize]
		[HttpGet("client_dropdown_list")]
		public async Task<IActionResult> ClientDropDownList()
		{
			var value = await _clientServices.RetrieveClientsDropDown();
			return value;
		}

		[Authorize]
		[HttpGet("employment_dropdown_list")]
		public async Task<IActionResult> EmploymentDropDownList()
		{
			var value = await _clientServices.RetrieveEmploymentDropDown();
			return value;
		}

		[Authorize]
		[HttpGet("job_status_dropdown_list")]
		public async Task<IActionResult> JobStatusDropDownList()
		{
			var value = await _clientServices.RetrieveJobStatusDropDown();
			return value;
		}

		[Authorize]
		[HttpGet("client_company_group_list")]
		public async Task<IActionResult> ClientCompanyGroup()
		{
			var value = await _clientServices.ClientCompanyGroupDropDown();
			return value;
		}

		[Authorize]
		[HttpGet("client_individual_list/{id}")]
		public async Task<IActionResult> ClientIndividualDropDownList(int id)
		{
			var value = await _clientServices.ClientIndividualDropDown(id);

			return value;
		}

		[Authorize]
		[HttpGet("job_profile_list")]
		public async Task<IActionResult> ClientJobProfileDropDownList([FromQuery] int id)
		{
			var value = await _clientServices.ClientJobProfileDropDown(id);

			return value;
		}
		#endregion


	}
}
