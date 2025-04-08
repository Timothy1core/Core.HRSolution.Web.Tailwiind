#nullable disable
public class WorkFromHomeInformation
{
	public int CandidateId { get; set; }

	public string WorkLocation { get; set; }

	public string PinLocation { get; set; }

	public string InternetProvider { get; set; }

	public string InternetService { get; set; }

	public string UploadInternetSpeed { get; set; }

	public string DownloadInternetSpeed { get; set; }

	public string PlatformVideoCall { get; set; }

	public string MessengerAccount { get; set; }

	public string AvailabilityCall { get; set; }

	public bool? SetUpWorkStation1 { get; set; }

	public bool? SetUpWorkStation2 { get; set; }

	public bool? SetUpWorkStation3 { get; set; }

	public bool? SetUpWorkStation4 { get; set; }

	public bool? SetUpWorkStation5 { get; set; }

	public bool? SetUpWorkStation6 { get; set; }

	public bool? SurroundAreas1 { get; set; }

	public bool? SurroundAreas2 { get; set; }

	public bool? SurroundAreas3 { get; set; }

	public bool? SurroundAreas4 { get; set; }

	public bool? SurroundAreas5 { get; set; }

	public bool? SurroundAreas6 { get; set; }

	public bool? SurroundAreas7 { get; set; }

	public bool? SurroundAreas8 { get; set; }

	public bool? SurroundAreas9 { get; set; }

	public bool? SurroundAreas10 { get; set; }

	public bool? WorkFromHomeApproval { get; set; }

	public string WorkFromHomeApprovalBy { get; set; }

	public bool? WorkFromHomeApproval1 { get; set; }

	public string WorkFromHomeApprovalBy1 { get; set; }
	public virtual Candidate Candidate { get; set; }
}

