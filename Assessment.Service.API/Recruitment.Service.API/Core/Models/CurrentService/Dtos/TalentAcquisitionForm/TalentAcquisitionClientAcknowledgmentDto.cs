namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.TalentAcquisitionForm
{
	public class TalentAcquisitionClientAcknowledgmentDto
	{
		public int Id { get; set; }
		public string Signature { get; set; }
		public DateTime ApprovedDate { get; set; }
		public string IpAddress { get; set; }
	}
}
