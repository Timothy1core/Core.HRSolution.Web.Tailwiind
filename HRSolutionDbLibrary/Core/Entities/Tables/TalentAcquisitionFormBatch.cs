#nullable disable


namespace HRSolutionDbLibrary.Core.Entities.Tables
{
	public class TalentAcquisitionFormBatch
	{
		public int Id { get; set; }

		public int Approver { get; set; }

		public bool? IsApproved { get; set; }

		public string Signature { get; set; }

		public DateTime? ApprovalDate { get; set; }

		public string ApprovalIp { get; set; }

		public DateTime SendDate { get; set; }

		public string SendBy { get; set; }

		public virtual DepartmentIndividual ApproverDetail { get; set; }

		public virtual ICollection<TalentAcquisitionForm> TalentAcquisitionForms { get; set; } = new List<TalentAcquisitionForm>();
	}
}
