namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.Department
{
	public class DepartmentInformationDto
	{
		public int Id { get; set; }

		public string Logo { get; set; }

		public string Name { get; set; }
		public string Alias { get; set; }

		public string Industry { get; set; }

		public string Website { get; set; }

		public string Timezone { get; set; }

		public string TimezoneOffset { get; set; }

		public int CoreServiceId { get; set; }

		public int DepartmentStatusId { get; set; }
		public string CoreService { get; set; }
		public string DepartmentStatus { get; set; }
		

	}
}
