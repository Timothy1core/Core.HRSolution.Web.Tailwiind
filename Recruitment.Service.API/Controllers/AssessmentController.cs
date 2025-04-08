using Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Recruitment.Service.API.Core.Applications;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;

namespace Recruitment.Service.API.Controllers
{
    // [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AssessmentController(
        IAssessmentServices assessmentServices
    ) : ControllerBase
    {
        private readonly IAssessmentServices _assessmentServices = assessmentServices;

		[Authorize]
		[Permission("system.create.assessment")]
        [HttpPost("create_assessment")]
        public async Task<IActionResult> CreateAssessment([FromForm] AssessmentRequestDto assessmentRequest)
        {
            var loggedEmployee = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        
            var result = await _assessmentServices.CreateAssessmentService(assessmentRequest, loggedEmployee);
        
            return result;
        }

        [Authorize]
        [Permission("system.retrieve.dashboard.assessment")]
        [HttpPost("list_assessment")]
        public async Task<IActionResult> RetrieveDashboardAssessment([FromForm] string? search)
        {
            var start = Convert.ToInt32(HttpContext.Request.Form["start"]);
            var length = Convert.ToInt32(HttpContext.Request.Form["length"]);
            string sortColumnName = HttpContext.Request.Form["sortColumnKey"]!;
            string sortDirection = HttpContext.Request.Form["sortDirection"]!;
            string draw = HttpContext.Request.Form["draw"]!;



            var result = await _assessmentServices.RetrieveAllAssessmentService(search, start, length, draw, sortColumnName, sortDirection);

            return result;
        }


        [Authorize]
        [Permission("system.retrieve.assessment.info")]
        [HttpGet("info_assessment/{id}")]
        public async Task<IActionResult> RetrieveAssessmentInfo(int id)
        {

            var result = await _assessmentServices.RetrieveAssessmentService(id);

            return result;

        }

        [Authorize]
        [Permission("system.update.assessment")]
        [HttpPut("update_assessment/{id}")]
        public async Task<IActionResult> UpdateAssessment(int id, [FromForm] AssessmentUpdateRequestDto assessmentRequest)
        {
            var loggedEmployee = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var result = await _assessmentServices.UpdateAssessmentService(id, assessmentRequest, loggedEmployee);
            return result;
        }

        [Authorize]
        [Permission("system.remove.assessment")]
        [HttpPut("remove_assessment/{id}")]
        public async Task<IActionResult> RemoveAssessmentInfo(int id)
        {
            var result = await _assessmentServices.RemoveAssessmentService(id);
            return result;
        }


        [Authorize]
        [Permission("system.retrieve.question.types")]
        [HttpGet("list_question_types")]
        public async Task<IActionResult> RetrieveQuestionTypes()
        {

            var result = await _assessmentServices.RetrieveQuestionTypesService();

            return result;
        }

        [Authorize]
        [Permission("system.assessment.create.question")]
        [HttpPost("create_question")]
        public async Task<IActionResult> CreateQuestion([FromForm] CreateQuestionRequestDto questionRequest)
        {
            var loggedEmployee = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        
            var result = await _assessmentServices.CreateQuestionService(questionRequest, loggedEmployee);
        
            return result;
        }

        [Authorize]
        [Permission("system.assessment.update.question")]
        [HttpPut("update_question/{id}")]
        public async Task<IActionResult> UpdateQuestion([FromForm] CreateQuestionRequestDto questionRequest, int id )
        {

            var result = await _assessmentServices.UpdateQuestionService(questionRequest, id);

            return result;
        }

        [Authorize]
        [Permission("system.assessment.remove.question")]
        [HttpPut("remove_question/{id}")]
        public async Task<IActionResult> RemoveQuestion(int id)
        {
            var result = await _assessmentServices.RemoveQuestionService(id);

            return result;
        }
    }
}