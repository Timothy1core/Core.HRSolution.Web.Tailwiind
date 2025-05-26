namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.Department
{
	public class DepartmentRequestDto
	{
		public IFormFile? Logo { get; set; }
		public string Name { get; set; }
		public int Industry { get; set; }
		public string Alias { get; set; }
		public string Website { get; set; }
		public int Timezone { get; set; }

		public int CoreServiceId { get; set; }

		public int DepartmentStatusId { get; set; }

		public List<DepartmentIndividualDto>? Individuals { get; set; }
	}
}
