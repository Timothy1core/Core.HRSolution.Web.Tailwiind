namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.JobProfile
{
    public class ClientJobProfileInformationDto
    {
       public ClientJobProfileRequestDto ClientJobProfile { get; set; }

        public List<JobApplicationQuestionRequestDto> ApplicationQuestions { get; set; }
        public bool HasApplicationProcess { get; set; }
        public List<JobAssessmentDto> Assessments { get; set; }

    }
}
