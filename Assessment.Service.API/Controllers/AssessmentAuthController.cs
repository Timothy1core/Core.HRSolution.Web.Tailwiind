using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Assessment.Service.API.Core.Applications;
using Assessment.Service.API.Core.Dto.Assessment;
using Assessment.Service.API.Persistence.Applications;
using Authentication;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Assessment.Service.API.Core.Dto.NewFolder;

namespace Assessment.Service.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AssessmentAuthController(
        IAssessmentServices assessmentService
    ) : ControllerBase
    {
        private readonly IAssessmentServices _assessmentService = assessmentService;


        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto loginRequest)
        {

            var candidate = await _assessmentService.AuthenticateCandidateService(loginRequest);
            return candidate;

        }

        [AllowAnonymous]
        [HttpGet("test")]
        public async Task<IActionResult> Test()
        {

	        return Ok("TEST");

        }

		[Authorize]
        [HttpGet("verify_token")]
        public async Task<IActionResult> VerifyToken()
        {
            var authHeader = Request.Headers["Authorization"].FirstOrDefault();
        
            if (authHeader == null) return Unauthorized();
        
            var candidateLogged = await _assessmentService.AuthenticateCandidateVerificationService(authHeader);
            return candidateLogged;
        
        }

        [Authorize]
        [HttpPut("update_assessment_is_started_status/{id}")]
        public async Task<IActionResult> UpdateAssessmentIsStartedStatus(int id)
        {
            var result = await _assessmentService.UpdateAssessmentIsStartedStatusService(id);
            return result;
        }

        [Authorize]
        [HttpPut("update_assessment_is_finished_status/{id}")]
        public async Task<IActionResult> UpdateAssessmentIsFinishedStatus(int id, [FromForm] int candidateId)
        {
            var result = await _assessmentService.UpdateAssessmentIsFinishedStatusService(id, candidateId);
            return result;
        }

        [Authorize]
        [HttpPost("submit_assessment_answer")]
        public async Task<IActionResult> SubmitAssessmentAnswer([FromForm] AssessmentAnswerDto assessmentAnswer)
        {
            var result = await _assessmentService.SubmitAssessmentAnswerService(assessmentAnswer);
            return result;
        }

        [Authorize]
        [HttpPut("submit_assessment_details/{id}")]
        public async Task<IActionResult> SubmitAssessmentDetails(int id, [FromForm] bool isFullscreenExit, [FromForm] bool isMouseExited)
        {
            var result = await _assessmentService.SubmitAssessmentDetailsService(id, isFullscreenExit, isMouseExited);
            return result;
        }

        [Authorize]
        [HttpPut("set_assessment_mouse_out/{id}")]
        public async Task<IActionResult> SetAssessmentMouseOut(int id, [FromForm] int mouseOutsideCounter)
        {
            var result = await _assessmentService.SetAssessmentMouseOutService(id, mouseOutsideCounter);
            return result;
        }

        [Authorize]
        [HttpPut("set_current_assessment_id/{id}")]
        public async Task<IActionResult> SetCurrentAssessmentId(int id, [FromForm] int assessmentId)
        {

            var result = await _assessmentService.SetCurrentAssessmentIdService(id, assessmentId);
            return result;
        }

        [Authorize]
        [HttpPost("submit_assessment_remaining_time")]
        public async Task<IActionResult> SubmitAssessmentRemainingTime([FromForm] AssessmentRemainingTimerDto assessmentRemainingTimer, int id)
        {
            var result = await _assessmentService.SubmitAssessmentRemainingTimeService(assessmentRemainingTimer, id);
            return result;
        }

        [Authorize]
        [HttpPut("update_assessment_remaining_time/{id}")]
        public async Task<IActionResult> UpdateAssessmentRemainingTime(int id, [FromForm] int remainingTime)
        {
            var result = await _assessmentService.UpdateAssessmentRemainingTimeService(id, remainingTime);
            return result;
        }

        [Authorize]
        [HttpPost("submit_candidate_snapshot")]
        public async Task<IActionResult> SubmitCandidateSnapshot([FromForm] CandidateSnapshotDto candidateSnapshotDto)
        {
            var result = await _assessmentService.SubmitCandidateSnapshotService(candidateSnapshotDto);
            return result;
        }


        [AllowAnonymous]
        [HttpGet("candidate_video_answer/{id}")]
        public async Task<IActionResult> CandidateVideoAnswer(int id)
        {

            var resume = await _assessmentService.RetrieveCandidateVideo(id);

            return PhysicalFile(resume.filePath, resume.contentType);
        }
    }
}
