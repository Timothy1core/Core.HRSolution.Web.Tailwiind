namespace HRIS.Service.API.Core.Models.CurrentService.Dto
{
	public class ExportFileResultDto
	{
		public byte[] FileContents { get; set; }
		public string ContentType { get; set; }
		public string FileName { get; set; }
	}
}
