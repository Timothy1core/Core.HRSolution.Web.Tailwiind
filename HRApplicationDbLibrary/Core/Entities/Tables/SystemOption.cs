namespace HRApplicationDbLibrary.Core.Entities.Tables
{
	public class SystemOption
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public string Value { get; set; }
		public string CreatedBy { get; set; }
		public DateTime CreatedDate { get; set; }
	}
}
