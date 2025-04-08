using Authentication;
using FileServiceLibrary;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph.Models;
using OutlookServiceLibrary;
using Recruitment.Service.API.Core.Applications;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Candidate;
using Recruitment.Service.API.Persistence.Applications;
using System.Net.Mail;
using System.Security.Claims;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.GraphUtilities;

namespace Recruitment.Service.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class CandidateController(
		ICandidateServices candidateServices,
		IFileService fileService,
		GraphService graphService

	) : ControllerBase
	{

		private readonly ICandidateServices _candidateServices = candidateServices;
		private readonly IFileService _fileService = fileService;
		private readonly GraphService _graphService = graphService;


		[Authorize]
		[Permission("recruitment.get.all.calendar.events")]
		[HttpPost("get_all_calendar_events")]
		public async Task<IActionResult> GetAllCalendarEvents([FromForm] string recipient)
		{
			var events = await _graphService.GetCalendarEventsByDistroEmailAsync("TalentAcquisition1@onecoredevit.com", recipient);


			var eventDetails = events.Select(e => new
			{
				
				e.Id,
				e.Subject,
				e.CreatedDateTime,
				Start = e.Start?.DateTime,
				End = e.End?.DateTime,
				Location = e.Location?.DisplayName,
				Organizer = e.Organizer?.EmailAddress?.Address,
				OrganizerName = e.Organizer?.EmailAddress?.Name,
				Attendees = e.Attendees?.Select(a => a.EmailAddress?.Name).ToList(),
				Body = e.Body?.Content, // Full email body
				MeetingLink = e.OnlineMeeting?.JoinUrl // Microsoft Teams or other meeting link
			});
			
			return Ok(eventDetails);

		}

		[Authorize]
		[Permission("recruitment.retrieve.emails.by.distro")]
		[HttpPost("retrieve_emails_by_distro")]
		public async Task<IActionResult> GetEmailsByDistroEmail([FromForm] string recipient)
		{

			var emails = await _graphService.GetEmailsByDistroEmailAsync("TalentAcquisition1@onecoredevit.com", recipient, 10);

			var emailDetails = emails.Select(e => new
			{
				e.Id,
				e.Subject,
				From = e.From?.EmailAddress?.Address,
				FromName = e.From?.EmailAddress?.Name,
				ToRecipients = e.ToRecipients?.Select(to => to.EmailAddress?.Address).ToList(),
				CcRecipients = e.CcRecipients?.Select(cc => cc.EmailAddress?.Address).ToList(),
				ReceivedDateTime = e.ReceivedDateTime,
				BodyPreview = e.BodyPreview
			});

			return Ok(emailDetails);
		}


		[Authorize]
		[Permission("recruitment.create.calendar.event")]
		[HttpPost("create_calendar_event")]
		public async Task<IActionResult> CreateCalendarEvent([FromForm] CreateCalendarEventRequestDto createCalendarEventRequestDto)
		{

			try
			{
				await _graphService.CreateCalendarEventAsync(
					createCalendarEventRequestDto.FromUserEmail,
					createCalendarEventRequestDto.Subject,
					createCalendarEventRequestDto.Body,
					createCalendarEventRequestDto.StartTime,
					createCalendarEventRequestDto.EndTime,
					createCalendarEventRequestDto.TimeZone,
					createCalendarEventRequestDto.AttendeesEmails
				);
				return Ok("Calendar event created successfully.");
			}
			catch (Exception ex)
			{
				return BadRequest($"Error: {ex.Message}");
			}
		}

		[AllowAnonymous]
		[HttpPost("send_email_to_candidate")]
		public async Task<IActionResult> SendEmailEvent([FromForm] SendEmailRequestDto sendEmailRequestDto)
		{


			try
			{
				await _graphService.SendEmailAsync(
					sendEmailRequestDto.FromUserEmail, 
					"jomari.mananghaya@onecoredevit.com", 
					sendEmailRequestDto.Subject,
					sendEmailRequestDto.Body);
				return Ok("Email sent successfully.");
			}
			catch (Exception ex)
			{
				return BadRequest($"Error: {ex.Message}");
			}

		}


		[AllowAnonymous]
		[HttpPost("apply_candidate")]
		public async Task<IActionResult> ApplyCandidate([FromForm] ApplyRequestDto candidate)
		{

			var result = await _candidateServices.ApplyCandidateApplicationForm(candidate);

			return result;
		}

		[Authorize]
		[Permission("recruitment.retrieve.dashboard.candidate")]
		[HttpPost("list_candidate")]
		public async Task<IActionResult> RetrieveDashboardCandidate([FromForm] string? search)
		{
			var start = Convert.ToInt32(HttpContext.Request.Form["start"]);
			var length = Convert.ToInt32(HttpContext.Request.Form["length"]);
			string sortColumnName = HttpContext.Request.Form["sortColumnKey"]!;
			string sortDirection = HttpContext.Request.Form["sortDirection"]!;
			string draw = HttpContext.Request.Form["draw"]!;
			var client = Convert.ToInt32(HttpContext.Request.Form["client"]);
			var clientGroup = Convert.ToInt32(HttpContext.Request.Form["clientGroup"]);
			var job = Convert.ToInt32(HttpContext.Request.Form["job"]);
			var qualification = Convert.ToInt32(HttpContext.Request.Form["qualification"]);
			var applicationProcess = Convert.ToInt32(HttpContext.Request.Form["applicationProcess"]);
			var source = Convert.ToInt32(HttpContext.Request.Form["source"]);

			var result = await _candidateServices.RetrieveAllCandidateService(
				search, start, length, draw,
				sortColumnName, sortDirection,
				client, clientGroup, job, qualification, applicationProcess, source);
			;
			return result;
		}

		[Authorize]
		[Permission("recruitment.retrieve.dashboard.candidate.offer")]
		[HttpPost("list_candidate_offer")]
		public async Task<IActionResult> RetrieveDashboardCandidateToOffer([FromForm] string? search)
		{
			var start = Convert.ToInt32(HttpContext.Request.Form["start"]);
			var length = Convert.ToInt32(HttpContext.Request.Form["length"]);
			string sortColumnName = HttpContext.Request.Form["sortColumnKey"]!;
			string sortDirection = HttpContext.Request.Form["sortDirection"]!;
			string draw = HttpContext.Request.Form["draw"]!;
			var status = Convert.ToInt32(HttpContext.Request.Form["client"]);


			var result = await _candidateServices.RetrieveCandidateToOfferService(
				search, start, length, draw,
				sortColumnName, sortDirection,
				status);
			;
			return result;
		}

		[Authorize]
		[Permission("recruitment.retrieve.candidate.info")]
		[HttpGet("info_candidate/{id}")]
		public async Task<IActionResult> RetrieveCandidateInfo(int id)
		{

			var result = await _candidateServices.RetrieveCandidateService(id);

			return result;

		}

		[Authorize]
		[Permission("recruitment.create.comment")]
		[HttpPost("create_comment")]
		public async Task<IActionResult> CreateComment([FromForm] CandidateCommentRequestDto candidateCommentRequestDto)
		{

			var result = await _candidateServices.CreateCommentService(candidateCommentRequestDto);

			return result;
		}

		[Authorize]
		[Permission("recruitment.create.candidate.write.up")]
		[HttpPost("create_candidate_write_up")]
		public async Task<IActionResult> CreateCandidateWriteUp([FromForm] CandidateWriteUpRequestDto candidateWriteUp, [FromForm] int candidateId)
		{
			var loggedEmployee = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
			var result = await _candidateServices.CreateCandidateWriteUpService(candidateWriteUp, candidateId,  loggedEmployee);

			return result;
		}

		[Authorize]
		[Permission("recruitment.retrieve.candidate.write.up")]
		[HttpGet("write_up_info/{id}")]
		public async Task<IActionResult> RetrieveWriteUpInfo(int id)
		{

			var result = await _candidateServices.RetrieveCandidateWriteUpService(id);

			return result;

		}

		[Authorize]
		[Permission("recruitment.update.candidate.write.up")]
		[HttpPut("update_write_up/{id}")]
		public async Task<IActionResult> UpdateCandidateWriteUp(int id, [FromForm] CandidateWriteUpRequestDto writeUpRequest)
		{
			//var loggedEmployee = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
			var result = await _candidateServices.UpdateWriteUpService(id, writeUpRequest);
			return result;
		}

		[Authorize]
		[Permission("recruitment.update.candidate.stage")]
		[HttpPut("update_stage/{id}")]
		public async Task<IActionResult> UpdateCandidateStage(int id, [FromForm] int stageId, [FromForm] string stageName)
		{
			var loggedEmployee = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
			var result = await _candidateServices.UpdateCandidateStageService(id, stageId, stageName, loggedEmployee);
			return result;
		}

		[Authorize]
		[Permission("recruitment.update.candidate.job")]
		[HttpPut("update_job/{id}")]
		public async Task<IActionResult> UpdateCandidateJob(int id, [FromForm] int jobId, [FromForm] int stageId, [FromForm] string jobName, [FromForm] string stageName)
		{
			var loggedEmployee = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
			var result = await _candidateServices.UpdateCandidateJobService(id, jobId, stageId, jobName, stageName, loggedEmployee);
			return result;
		}

		[Authorize]
		[Permission("recruitment.copy.candidate.job")]
		[HttpPost("copy_candidate_to_job")]
		public async Task<IActionResult> CopyCandidateToJob([FromForm] CopyToJobRequestDto candidate, [FromForm] string jobName, [FromForm] string stageName)
		{

			var result = await _candidateServices.CopyCandidateToJobService(candidate, jobName, stageName);

			return result;
		}

		[AllowAnonymous]
		[HttpGet("candidate_resume/{id}")]
		public async Task<IActionResult> CandidateResume(int id)
		{

			var resume = await _candidateServices.RetrieveCandidateResume(id);

			return PhysicalFile(resume.filePath, resume.contentType);
		}

		[Authorize]
		[Permission("recruitment.remove.candidate")]
		[HttpPut("remove_candidate/{id}")]
		public async Task<IActionResult> RemoveCandidate(int id)
		{
			var result = await _candidateServices.RemoveRoleService(id);
			return result;
		}

		[Authorize]
		[Permission("recruitment.disqualify.candidate")]
		[HttpPut("disqualify_candidate/{id}")]
		public async Task<IActionResult> DisqualifyCandidate(int id)
		{
			var loggedEmployee = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
			var result = await _candidateServices.DisqualifyCandidateService(id, loggedEmployee);
			return result;
		}

		[Authorize]
		[Permission("recruitment.retrieve.candidate.assessment.for.checking")]
		[HttpGet("retrieve_candidate_assessment_for_checking")]
		public async Task<IActionResult> RetrieveCandidateAssessmentForChecking([FromQuery] int candidateId, [FromQuery] int assessmentId)
		{
			var result = await _candidateServices.RetrieveCandidateAssessmentCheckingService(assessmentId, candidateId);
			return result;
		}

		[Authorize]
		[Permission("recruitment.create.candidate.credential")]
		[HttpPost("create_candidate_credential")]
		public async Task<IActionResult> CreateCandidateCredential([FromForm] candidateCredentialRequestDto candidateRequest)
		{
			var loggedEmployee = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
			var result = await _candidateServices.CreateCandidateCredentialForAssessment(candidateRequest, loggedEmployee);

			return result;
		}

		[AllowAnonymous]
		[HttpGet("retrieve_candidate_filter")]
		public async Task<IActionResult> RetrieveCandidateFilter()
		{

			var result = await _candidateServices.RetrieveCandidateFilterService();

			return result;
		}

		[Authorize]
		[Permission("recruitment.submit.candidate.correction")]
		[HttpPut("submit_candidate_correction/{id}")]
		public async Task<IActionResult> SubmitCandidateCorrection(int id, [FromForm] bool isCorrect)
		{

			var result = await _candidateServices.SubmitCandidateCorrectionService(id, isCorrect);
			return result;
		}

	}
}
