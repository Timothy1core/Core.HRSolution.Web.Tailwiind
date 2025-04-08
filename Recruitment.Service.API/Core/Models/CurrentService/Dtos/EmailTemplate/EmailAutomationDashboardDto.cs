namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.EmailTemplate
{
	public class EmailAutomationDashboardDto
	{
		public int Id { get; set; }
		public int? JobId { get; set; }
		public int? StageId { get; set; }
		public int TemplateId { get; set; }
		public int? TypeId { get; set; }

		public string JobName { get; set; }
		public string StageName { get; set; }
		public string TemplateName { get; set; }


		public string EmailAutomation
		{
			get
			{
				return TypeId switch
				{
					1 => $"When a candidate applies to {(JobId.HasValue ? JobName : "any job")}, then send them a {TemplateName}.",
					2 => $"When a candidate in {(JobId.HasValue ? JobName : "any job")} is disqualified at {(StageId.HasValue ? StageName : "any stage")}, then send them a {TemplateName}.",
					3 => $"When a candidate in {(JobId.HasValue ? JobName : "any job")} is moved to {StageName}, then send them a {TemplateName}.",
					_ => $"When a candidate in {(JobId.HasValue ? JobName : "any job")}, is invited for assessment, then send the a {TemplateName}."
				};
			}
		}
	}
}