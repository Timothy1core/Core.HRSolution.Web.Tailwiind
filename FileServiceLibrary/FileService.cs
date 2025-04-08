using Microsoft.AspNetCore.StaticFiles;

namespace FileServiceLibrary
{
	public class FileService(string fileRootFolder) : IFileService
	{
		private readonly string _fileRootFolder = fileRootFolder ?? throw new ArgumentNullException(nameof(fileRootFolder));

		public async Task<(string FilePath, string ContentType)> GetDocumentUrlAsync(string filePath)
		{
			var rootFilePath = Path.Combine(_fileRootFolder, filePath);

			if (!await Task.Run(() => File.Exists(rootFilePath)))
			{
				throw new FileNotFoundException($"File not found: {rootFilePath}");
			}

			var fileProvider = new FileExtensionContentTypeProvider();
			if (!fileProvider.TryGetContentType(rootFilePath, out string contentType))
			{
				throw new ArgumentOutOfRangeException($"Unable to find Content Type for file name {rootFilePath}.");
			}

			return (rootFilePath, contentType);

		}
	}

	public interface IFileService
	{
		Task<(string FilePath, string ContentType)> GetDocumentUrlAsync(string filePath);
	}
}
