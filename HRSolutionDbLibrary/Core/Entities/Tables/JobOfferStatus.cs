#nullable disable
namespace HRSolutionDbLibrary.Core.Entities.Tables;

public class JobOfferStatus
{
	public int Id { get; set; }

	public string Status { get; set; }

	public bool? IsActive { get; set; }

	public string CreatedBy { get; set; }

	public DateTime? CreatedDate { get; set; }

	public virtual ICollection<JobOfferInformation> JobOfferInformations { get; set; } = new List<JobOfferInformation>();
}