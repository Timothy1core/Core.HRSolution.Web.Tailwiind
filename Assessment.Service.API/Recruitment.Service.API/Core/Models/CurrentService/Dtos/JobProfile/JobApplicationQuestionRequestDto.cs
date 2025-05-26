namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.JobProfile
{
    public class JobApplicationQuestionRequestDto
    {
        public int? Id { get; set; }

        public int JobId { get; set; }

        public string Body { get; set; }

        public string Type { get; set; }

        public bool Required { get; set; }

        public ICollection<JobApplicationChoicesRequestDto>? ApplicationChoices { get; set; }

    }
}
