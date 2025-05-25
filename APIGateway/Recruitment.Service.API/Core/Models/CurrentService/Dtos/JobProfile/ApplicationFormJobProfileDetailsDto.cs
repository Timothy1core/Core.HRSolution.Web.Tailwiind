namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.JobProfile
{
    public class ApplicationFormJobProfileDetailsDto
    {
        public string CompanyName { get; set; }

        public string Position { get; set; }

        public string EmploymentType { get; set; }

        public string JobDescription { get; set; }

        public string Education { get; set; }

        public string Experience { get; set; }

        public string KeyResponsibility { get; set; }

        public string Qualifications { get; set; }

        public List<JobApplicationQuestionRequestDto> Questions { get; set; }
    }
}
