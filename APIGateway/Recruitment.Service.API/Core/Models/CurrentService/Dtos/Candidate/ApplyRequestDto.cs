namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.Candidate
{
    public class ApplyRequestDto
    {
        public int Id{ get; set; }
        public string FirstName{ get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string? CurrentSalary { get; set; }
        public string? ExpectedSalary { get; set; }
        public string? CurrentEmploymentStatus { get; set; }
        public string? NoticePeriod { get; set; }
        public IFormFile Resume { get; set; }
        public List<ApplyAnswerRequestDto> Questions { get; set; }
    }
}
