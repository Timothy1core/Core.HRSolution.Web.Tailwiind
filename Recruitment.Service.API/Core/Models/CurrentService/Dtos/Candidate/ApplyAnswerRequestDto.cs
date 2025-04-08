namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.Candidate
{
    public class ApplyAnswerRequestDto
    {
        public int QuestionId { get; set; }
        public string? Answer { get; set; }
    }
}
