using EmailServiceLibrary;
using HRSolutionDbLibrary.Core.Entities.Tables;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Graph.Models.ExternalConnectors;
using Novacode;
using Recruitment.Service.API.Core.UnitOfWork;
using System.IO;
using System.Threading.Tasks;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using HtmlToOpenXml;
using Recruitment.Service.API.Core.Helpers;
using Paragraph = DocumentFormat.OpenXml.Wordprocessing.Paragraph;
using Run = DocumentFormat.OpenXml.Wordprocessing.Run;

namespace Recruitment.Service.API.Persistence.Helpers
{
	public class JobProfileHelper(
		IWebHostEnvironment webHostEnvironment,
		IConfiguration configuration,
		IEmailService emailService,
		IUoWForCurrentService uoWForCurrentService
	) : IJobProfileHelper
	{
		private readonly IEmailService _emailService = emailService;
		private readonly IUoWForCurrentService _uniForCurrentService = uoWForCurrentService;
		private readonly string? _fileRootFolder = webHostEnvironment.IsDevelopment() ? webHostEnvironment.ContentRootPath : configuration.GetSection("baseFileLocation").Value;

		public async Task GenerateJobProfilePdfAsync(JobProfile jobProfile)
		{
		    var documentTemplate = Path.Combine(_fileRootFolder!, "document_template", "job_profile_template.docx");
		    var generatedPath = Path.Combine(_fileRootFolder!, "document_template", "job_profile_to_pdf.docx");
		    var tafPath = Path.Combine(_fileRootFolder!, "client_profile", jobProfile.Department.Id.ToString(), "job_profile");

		    if (!Directory.Exists(tafPath))
		    {
		        Directory.CreateDirectory(tafPath);
		    }

		    var pdfPath = Path.Combine(tafPath, $"Job Profile - {jobProfile.Position}.pdf");

		    // Copy the template to a working file
		    File.Copy(documentTemplate, generatedPath, true);

		    using (var wordDoc = WordprocessingDocument.Open(generatedPath, true))
		    {
		        var mainPart = wordDoc.MainDocumentPart!;
		        var htmlConverter = new HtmlConverter(mainPart);

		        var body = mainPart.Document.Body;

		        ReplacePlaceholderWithText(body, "{job_title}", jobProfile.Position);
		        ReplacePlaceholderWithText(body, "{department_name}", jobProfile.Department.Name);

		        ReplacePlaceholderWithHtml(body, "{job_description}", jobProfile.JobDescription, htmlConverter);
		        ReplacePlaceholderWithHtml(body, "{education}", jobProfile.Education, htmlConverter);
		        ReplacePlaceholderWithHtml(body, "{experience}", jobProfile.Experience, htmlConverter);
		        ReplacePlaceholderWithHtml(body, "{key_responsibilities}", jobProfile.KeyResponsibility, htmlConverter);
		        ReplacePlaceholderWithHtml(body, "{qualifications}", jobProfile.Qualifications, htmlConverter);

		        mainPart.Document.Save();
		    }

		    // Convert to PDF using Spire.Doc
		    var spireDoc = new Spire.Doc.Document();
		    spireDoc.LoadFromFile(generatedPath);
		    spireDoc.SaveToFile(pdfPath, Spire.Doc.FileFormat.PDF);
		}
		private static void ReplacePlaceholderWithText(Body body, string placeholder, string value)
		{
			foreach (var paragraph in body.Elements<Paragraph>())
			{
				string fullText = string.Concat(paragraph.Descendants<Text>().Select(t => t.Text));

				if (fullText.Contains(placeholder))
				{
					// Clear all runs inside the paragraph
					paragraph.RemoveAllChildren<Run>();

					// Create a new run with the replacement text
					var newRun = new Run(new Text(fullText.Replace(placeholder, value ?? string.Empty)));
					paragraph.Append(newRun);
				}
			}
		}


		private static void ReplacePlaceholderWithHtml(Body body, string placeholder, string htmlContent, HtmlConverter htmlConverter)
		{
			var paragraph = body.Elements<Paragraph>()
				.FirstOrDefault(p => p.InnerText.Contains(placeholder));

			if (paragraph == null) return;

			var parent = paragraph.Parent;

			// Remove the placeholder paragraph
			parent.RemoveChild(paragraph);

			// Convert and insert the HTML content
			var htmlElements = htmlConverter.Parse(htmlContent ?? string.Empty);
			foreach (var element in htmlElements)
			{
				parent.Append(element);
			}
		}


	}


}
