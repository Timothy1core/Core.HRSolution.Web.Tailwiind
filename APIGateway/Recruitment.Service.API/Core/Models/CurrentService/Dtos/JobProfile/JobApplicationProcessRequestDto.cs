namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.JobProfile
{
    public class JobApplicationProcessRequestDto
    {
        public int JobId { get; set; }
        public List<int> ApplicationProcessId { get; set; }

    }
}
