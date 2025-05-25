using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Authentication;
using Recruitment.Service.API.Core.Applications;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.JobProfile;
using Recruitment.Service.API.Persistence.Applications;

namespace Recruitment.Service.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class JobProfileController(
		IJobProfileServices jobProfileServices,
		IAssessmentServices assessmentServices
	   
	) : ControllerBase
	{
		private readonly IJobProfileServices _jobProfileServices = jobProfileServices;
		private readonly IAssessmentServices _assessmentServices = assessmentServices;

		[Authorize]
		[Permission("department.job.profile.create")]
		[HttpPost("create_job_profile")]
		public async Task<IActionResult> CreateClientJobProfile([FromForm] ClientJobProfileRequestDto clientJobProfileRequest)
		{
			var loggedEmployee = User.FindFirstValue(ClaimTypes.NameIdentifier)!;


			var result = await _jobProfileServices.CreateClientJobProfile(clientJobProfileRequest, loggedEmployee);

			return result;
		}

		[Authorize]
		[Permission("department.job.profile.update")]
		[HttpPost("create_job_application")]
		public async Task<IActionResult> CreateJobApplication([FromForm] List<JobApplicationQuestionRequestDto> applicationQuestion)
		{
			var loggedEmployee = User.FindFirstValue(ClaimTypes.NameIdentifier)!;


			var result = await _jobProfileServices.CreateJobApplicationForm(applicationQuestion, loggedEmployee);

			return result;
		}


		[Authorize]
		[Permission("department.job.profile.list")]
		[HttpGet("retrieve_dashboard_job_profile/{companyId}")]
		public async Task<IActionResult> RetrieveDashboardClientJobProfile(int companyId)
		{

			var result = await _jobProfileServices.RetrieveClientJobProfileDashboard(companyId);

			return result;
		}
		[Authorize]
		[Permission("department.job.profile.retrieve")]
		[HttpGet("retrieve_information_job_profile/{jobId}")]
		public async Task<IActionResult> RetrieveInformationClientJobProfile(int jobId)
		{
			var result = await _jobProfileServices.RetrieveClientJobProfileInformation(jobId);

			return result;
		}

		[Authorize]
		[Permission("job.profile.list")]
		[HttpGet("retrieve_dashboard_job_profile")]
		public async Task<IActionResult> RetrieveDashboardJobProfile()
		{

			var result = await _jobProfileServices.RetrieveJobProfileDashboard();

			return result;
		}

		[Authorize]
		[Permission("department.job.profile.update")]
		[HttpPost("create_job_application_process")]
		public async Task<IActionResult> CreateJobApplicationProcess([FromForm] JobApplicationProcessRequestDto jobApplicationProcess)
		{
			var result = await _jobProfileServices.CreateClientJobProfileApplicationProcess(jobApplicationProcess);

			return result;
		}

		[Authorize]
		[HttpGet("retrieve_available_assessment")]
		public async Task<IActionResult> RetrieveAvailableAssessment()
		{
			const string search = "";
			const int start = 0;
			const int length = 9999;
			const string sortColumnName = "id";
			const string sortDirection = "asc";
			const string draw = "1";

			var result = await _assessmentServices.RetrieveAllAssessmentService(search, start, length, draw, sortColumnName, sortDirection);

			return result;
		}

		[Authorize]
		[HttpGet("retrieve_application_process")]
		public async Task<IActionResult> RetrieveApplicationProcess()
		{

			var result = await _jobProfileServices.RetrieveApplicationProcess();

			return result;
		}

		[Authorize]
		[Permission("department.job.profile.update")]
		[HttpPost("create_job_assessment")]
		public async Task<IActionResult> CreateJobAssessment([FromForm] List<JobApplicationAssessmentRequestDto> jobApplicationAssessment)
		{
			var loggedEmployee = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

			var result = await _jobProfileServices.CreateClientJobProfileAssessment(jobApplicationAssessment, loggedEmployee);

			return result;
		}


		[Authorize]
		[Permission("department.job.profile.update")]
		[HttpPut("update_job_profile/{id}")]
		public async Task<IActionResult> UpdateJobApplication(int id, [FromForm] ClientJobProfileRequestDto jobProfile)
		{


			var result = await _jobProfileServices.UpdateClientJobProfile(jobProfile, id);

			return result;
		}

		[AllowAnonymous]
		[HttpGet("job_profile_info/{id}")]
		public async Task<IActionResult> ApplicationJobProfileDetails(int id)
		{

			var result = await _jobProfileServices.RetrieveApplicationFormJobProfile(id);

			return result;
		}



		[AllowAnonymous]
		[HttpGet("job_posted")]
		public async Task<IActionResult> CareerJobProfileList()
		{

			var result = await _jobProfileServices.RetrieveCareersJobProfileDashboard();
			return result;
		}


		[Authorize]
		[HttpGet("retrieve_all_job_profile")]
		public async Task<IActionResult> RetrieveAllJobProfile()
		{

			var result = await _jobProfileServices.SelectAllJobProfileDropDown();

			return result;
		}

		[Authorize]
		[HttpGet("retrieve_application_process_dropdown")]
		public async Task<IActionResult> RetrieveJobProfileApplicationProcess()
		{

			var result = await _jobProfileServices.SelectApplicationProcessDropDown();

			return result;
		}

		[AllowAnonymous]
		[HttpGet("job_profile_pdf/{id}")]
		public async Task<IActionResult> GenerateJobProfileDocument(int id)
		{

			var logo = await _jobProfileServices.GenerateJobProfilePdf(id);

			return PhysicalFile(logo.filePath, logo.contentType);
		}

		[AllowAnonymous]
		[HttpGet("market_research_document/{id}/{filename}")]
		public async Task<IActionResult> MarketResearchDocument(int id,string filename)
		{

			var logo = await _jobProfileServices.ViewMarketScanFile(id, filename);

			return PhysicalFile(logo.filePath, logo.contentType);
		}
	}
}
