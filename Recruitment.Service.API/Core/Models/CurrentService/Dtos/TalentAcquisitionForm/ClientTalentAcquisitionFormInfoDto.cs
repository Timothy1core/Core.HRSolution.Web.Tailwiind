namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.TalentAcquisitionForm
{
	public class ClientTalentAcquisitionFormInfoDto
	{

		public int Id { get; set; }
		public string ClientApproverName { get; set; }
		public string ClientApproverEmail { get; set; }
		public string CompanyName { get; set; }
		public string ApproveDate { get; set; }
		public string Signature { get; set; }

		public List<TalentAcquisitionFormDashboardDto> TalentAcquisitionForms { get; set; }
	}
}
