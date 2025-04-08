namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.JobProfile
{
    public class JobApplicationChoicesRequestDto
    {
        public int? Id { get; set; }

        public int ApplicationQuestionId { get; set; }

        public string Body { get; set; }

    }
}
