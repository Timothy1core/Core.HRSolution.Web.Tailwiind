using Authentication;
using FileServiceLibrary;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Recruitment.Service.API.Core.Applications;
using Recruitment.Service.API.Persistence.Applications;
using System.Security.Claims;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.TalentAcquisitionForm;
using Microsoft.Graph.Models.Security;
using Microsoft.Graph.Models;

namespace Recruitment.Service.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class TalentAcquisitionFormController(
		ITalentAcquisitionFormServices talentAcquisitionFormServices

	) : ControllerBase
	{
		private readonly ITalentAcquisitionFormServices _talentAcquisitionFormServices = talentAcquisitionFormServices;

		#region MyRegion

		[Authorize]
		[HttpGet("reason_list")]
		public async Task<IActionResult> TAFReasonDropDownList()
		{
			var value = await _talentAcquisitionFormServices.RetrieveTAFReasonDropDown();
			return value;
		}

		[Authorize]
		[HttpGet("status_list")]
		public async Task<IActionResult> TAFStatusDropDownList()
		{
			var value = await _talentAcquisitionFormServices.RetrieveTAFStatusDropDown();
			return value;
		}

		[Authorize]
		[HttpGet("work_arrangement_list")]
		public async Task<IActionResult> WorkArrangementDropDownList()
		{
			var value = await _talentAcquisitionFormServices.RetrieveWorkArrangementDropDown();
			return value;
		}

		[Authorize]
		[HttpGet("taf_list")]
		public async Task<IActionResult> TalentAcquisitionFormDropDownList([FromQuery] int id)
		{
			var value = await _talentAcquisitionFormServices.RetrieveTAFDropDown(id);
			return value;
		}
		#endregion

		[Authorize]
		[Permission("taf.create")]
		[HttpPost("create")]
		public async Task<IActionResult> CreateTalentAcquisitionForm([FromForm] TalentAcquisitionFormRequestDto tafRequestDto)
		{
			var loggedEmployee = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

			var result = await _talentAcquisitionFormServices.CreateTalentAcquisitionForm(tafRequestDto, loggedEmployee);

			return result;
		}

		
		[Authorize]
		[Permission("taf.dashboard")]
		[HttpPost("dashboard")]
		public async Task<IActionResult> DashboardTalentAcquisitionForm([FromForm] string? search, [FromForm] int groupId, [FromForm] int departmentId, [FromForm] int reasonId, [FromForm] int status)
		{
			var start = Convert.ToInt32(HttpContext.Request.Form["start"]);
			var length = Convert.ToInt32(HttpContext.Request.Form["length"]);
			string sortColumnName = HttpContext.Request.Form["sortColumnKey"]!;
			string sortDirection = HttpContext.Request.Form["sortDirection"]!;
			string draw = HttpContext.Request.Form["draw"]!;


			var result = await _talentAcquisitionFormServices.RetrieveTalentAcquisitionFormDashboard(groupId, departmentId, status, reasonId, search, start, length, draw, sortColumnName, sortDirection);


			return result;
		}


		[Authorize]
		[Permission("taf.update")]
		[HttpPut("update/{id}")]
		public async Task<IActionResult> UpdateTalentAcquisitionForm(int id, [FromForm] TalentAcquisitionFormRequestDto tafRequestDto)
		{
			var loggedEmployee = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

			tafRequestDto.Id = id;
			var result = await _talentAcquisitionFormServices.UpdateTalentAcquisitionForm(tafRequestDto, loggedEmployee);

			return result;
		}

		[Authorize]
		[Permission("taf.view.information")]
		[HttpGet("view_taf/{id}")]
		public async Task<IActionResult> SelectTalentAcquisitionForm(int id)
		{

			var result = await _talentAcquisitionFormServices.SelectTalentAcquisitionFormDetail(id);

			return result;
		}

		[Authorize]
		[Permission("taf.send.batch.taf")]
		[HttpPost("send")]
		public async Task<IActionResult> SendBatchTalentAcquisitionForm([FromForm] TalentAcquisitionFormBatchDto tafRequestDto)
		{
			var loggedEmployee = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

			var result = await _talentAcquisitionFormServices.SendTalentAcquisitionForm(tafRequestDto, loggedEmployee);

			return result;
		}

		[AllowAnonymous]
		[HttpGet("view_taf_form/{id}")]
		public async Task<IActionResult> SelectClientTalentAcquisitionForm(int id)
		{

			var result = await _talentAcquisitionFormServices.SelectTalentAcquisitionForm(id);

			return result;
		}


		[AllowAnonymous]
		[HttpPut("save_client_acknowledgment/{id}")]
		public async Task<IActionResult> SaveClientAcknowledgment(int id, [FromForm] string signature)
		{
			var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
			var taf = new TalentAcquisitionClientAcknowledgmentDto()
			{
				Id = id,
				Signature = signature,
				ApprovedDate = DateTime.UtcNow.AddHours(8),
				IpAddress = ipAddress,

			};
			var result = await _talentAcquisitionFormServices.SaveClientAcknowledgment(taf);

			return result;
		}
	}
}
