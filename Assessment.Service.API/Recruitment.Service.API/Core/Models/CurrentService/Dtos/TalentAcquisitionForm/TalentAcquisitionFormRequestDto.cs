namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.TalentAcquisitionForm
{
	public class TalentAcquisitionFormRequestDto
	{
		public int? Id { get; set; }
		public int JobId { get; set; }

		public DateTime RequestDate { get; set; }
		public int DepartmentId { get; set; }
		public int StatusId { get; set; }

		public int ReasonId { get; set; }

		public int Headcount { get; set; }

		public string Negotiable { get; set; }

		public string NonNegotiable { get; set; }

		public string Schedule { get; set; }

		public int HiringManager { get; set; }

		public string InterviewSchedule { get; set; }

		public int WorkArrangement { get; set; }

		public DateTime TargetStartDate { get; set; }

		public string TargetSalaryRange { get; set; }

		public string Equipment { get; set; }

		public string Notes { get; set; }

	}
}
