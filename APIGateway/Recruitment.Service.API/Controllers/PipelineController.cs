using Authentication;
using FileServiceLibrary;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Recruitment.Service.API.Core.Applications;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Candidate;
using Recruitment.Service.API.Persistence.Applications;
using System.Security.Claims;

namespace Recruitment.Service.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PipelineController(
        ICandidateServices candidateServices,
        IFileService fileService

    ) : ControllerBase
    {

        private readonly ICandidateServices _candidateServices = candidateServices;
        private readonly IFileService _fileService = fileService;


        [AllowAnonymous]
        // [Permission("recruitment.retrieve.dashboard.pipeline")]
        [HttpPost("list_pipelines")]
        public async Task<IActionResult> RetrievePipeline()
        {
            // var start = Convert.ToInt32(HttpContext.Request.Form["start"]);
            // var length = Convert.ToInt32(HttpContext.Request.Form["length"]);
            // string sortColumnName = HttpContext.Request.Form["sortColumnKey"]!;
            // string sortDirection = HttpContext.Request.Form["sortDirection"]!;
            // string draw = HttpContext.Request.Form["draw"]!;

            var result = await _candidateServices.RetrieveAllPipeline();

            return result;
        }

    }
}
