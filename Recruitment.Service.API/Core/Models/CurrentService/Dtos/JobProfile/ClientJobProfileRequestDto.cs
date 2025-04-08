namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.JobProfile
{
    public class ClientJobProfileRequestDto
    {
        public int? Id { get; set; }

        public int DepartmentId { get; set; }

        public string Position { get; set; }

        public int EmploymentTypeId { get; set; }

        public int JobStatusId { get; set; }

        public string JobDescription { get; set; }

        public string Education { get; set; }

        public string Experience { get; set; }

        public string KeyResponsibility { get; set; }

        public string Qualifications { get; set; }
        public bool ShowInCareerPage { get; set; }
        public IFormFile? MarketScanFile { get; set; }
        public string? MarketScanFileName { get; set; }
    }
}
