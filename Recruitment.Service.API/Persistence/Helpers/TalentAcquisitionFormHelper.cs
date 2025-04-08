using EmailServiceLibrary.Core.Model.Dto;
using EmailServiceLibrary;
using HRSolutionDbLibrary.Core.Entities.Tables;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Novacode;
using Novacode.NETCorePort;
using Recruitment.Service.API.Core.Helpers;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos;
using Recruitment.Service.API.Core.UnitOfWork;

namespace Recruitment.Service.API.Persistence.Helpers
{
	public class TalentAcquisitionFormHelper(
		IWebHostEnvironment webHostEnvironment,
		IConfiguration configuration, 
		IEmailService emailService,
		IUoWForCurrentService uoWForCurrentService


		) : ITalentAcquisitionFormHelper

	{
		private readonly IEmailService _emailService = emailService;
		private readonly IUoWForCurrentService _uniForCurrentService = uoWForCurrentService;
		private readonly string? _fileRootFolder = webHostEnvironment.IsDevelopment() ? webHostEnvironment.ContentRootPath : configuration.GetSection("baseFileLocation").Value;

		public async Task CreateDocumentSigned(TalentAcquisitionFormBatch taf)
		{
			var documentTemplate = Path.Combine(_fileRootFolder!, "document_template", "TAF TEMPLATE.docx");
			var generatedPath = Path.Combine(_fileRootFolder!, "document_template", "TEST.docx");
			var tafPath = Path.Combine(_fileRootFolder!, "client_profile",taf.ApproverDetail.Department.Id.ToString(),"taf");

			if (!Directory.Exists(tafPath))
			{
				Directory.CreateDirectory(tafPath);
			}
			var pdfPath = Path.Combine(tafPath, "TAF-" + taf.ApproverDetail.Department + "-" + taf.Id + ".pdf");
			var fontStyle = new Formatting
			{
				FontFamily = new Font("Albert Sans"),
				Size = 10,
			};
			using var document = DocX.Load(documentTemplate);

			
			document.ReplaceText("{CompanyName}", taf.ApproverDetail.Department.Name);
			document.ReplaceText("{ClientName}", taf.ApproverDetail.Name);
			document.ReplaceText("{ClientEmail}", taf.ApproverDetail.Email);
			document.ReplaceText("{Datetime}", taf.ApprovalDate?.ToString("d"));

			var signatureBytes = Convert.FromBase64String(taf.Signature.Replace("data:image/png;base64,", ""));
			var tempImagePath = Path.Combine(Path.GetTempPath(), "signature.png");

			await File.WriteAllBytesAsync(tempImagePath, signatureBytes);

			var imageParagraphs = document.Paragraphs.Where(p => p.Text.Contains("{Signature}")).ToList();
			var image = document.AddImage(tempImagePath); 
			var picture = image.CreatePicture(50, 150);
			foreach (var imageParagraph in imageParagraphs.OfType<Paragraph>())
			{
				imageParagraph.AppendPicture(picture);
				imageParagraph.ReplaceText("{Signature}", string.Empty);
				imageParagraph.AppendLine(taf.ApprovalDate?.ToString("G"));
				imageParagraph.AppendLine(taf.ApproverDetail.Name);
			}
			

			File.Delete(tempImagePath);

			var table = document.Tables[0];
			foreach (var emp in taf.TalentAcquisitionForms)
			{
				var newRow = table.InsertRow();



				var cell0 = newRow.Cells[0].Paragraphs[0];
				cell0.InsertText(emp.Job.Position, false, fontStyle);
				cell0.Alignment = Alignment.center;

				var cell1 = newRow.Cells[1].Paragraphs[0];
				cell1.InsertText(emp.Headcount.ToString(), false, fontStyle);
				cell1.Alignment = Alignment.center;

				var cell2 = newRow.Cells[2].Paragraphs[0];
				cell2.InsertText(emp.HiringManagerNavigation.Name, false, fontStyle);
				cell2.Alignment = Alignment.center;

				var cell3 = newRow.Cells[3].Paragraphs[0];
				cell3.InsertText(emp.TargetStartDate.ToString("d"), false, fontStyle);
				cell3.Alignment = Alignment.center;
			}

			document.SaveAs(generatedPath);

			// Convert Word document to PDF
			var spireDoc = new Spire.Doc.Document();
			spireDoc.LoadFromFile(generatedPath); 
			spireDoc.SaveToFile(pdfPath, Spire.Doc.FileFormat.PDF); 
		}


		public async Task SendEmailForAcknowledgement(TalentAcquisitionFormBatch taf)
		{
			var emailTemplatePath = Path.Combine(_fileRootFolder ?? string.Empty, "document_template", "EmailTemplate.html");

			var str = new StreamReader(emailTemplatePath);
			var mailText = str.ReadToEnd();
			str.Close();

			var tafLink = webHostEnvironment.IsDevelopment()?  "http://localhost:5173/client/taf/" :   "https://172.16.254.4/client/taf/";

			var emailContent =await _uniForCurrentService.EmailTemplateRepository.SelectEmailTemplateInformation(1);

			emailContent.EmailBody = emailContent.EmailBody.Replace("[client_fullname]", taf.ApproverDetail.Name);
			emailContent.EmailBody = emailContent.EmailBody.Replace("[taf_link]", tafLink + taf.Id);


			mailText = mailText.Replace("[EmailTo]", "Hi "+taf.ApproverDetail.Name);
			mailText= mailText.Replace("[Subject]", emailContent.Name.ToUpper());
			mailText= mailText.Replace("[EmailBody]", emailContent.EmailBody);


			var emailDto = new EmailDto()
			{
				SentTo = [taf.ApproverDetail.Email],
				Body = mailText,
				Subject = emailContent.Subject
			};


			await emailService.SendEmailAsyncNew(emailDto);


		}

		public async Task SendEmailForSignedDocument(TalentAcquisitionFormBatch taf)
		{
			//var emailTemplatePath = webHostEnvironment.ContentRootFileProvider.GetFileInfo("document_template/EmailTemplate.html").PhysicalPath;
			var emailTemplatePath = Path.Combine(_fileRootFolder ?? string.Empty, "document_template", "EmailTemplate.html");

			var str = new StreamReader(emailTemplatePath);
			var mailText = str.ReadToEnd();
			str.Close();

			var tafLink = webHostEnvironment.IsDevelopment() ? "http://localhost:5173/client/taf/" : "https://172.16.254.4/client/taf/";

			var emailContent = await _uniForCurrentService.EmailTemplateRepository.SelectEmailTemplateInformation(2);

			emailContent.EmailBody = emailContent.EmailBody.Replace("[client_fullname]", taf.ApproverDetail.Name);
			emailContent.EmailBody = emailContent.EmailBody.Replace("[taf_link]", tafLink + taf.Id);

			mailText = mailText.Replace("[EmailTo]", "Hi " + taf.ApproverDetail.Name);
			mailText = mailText.Replace("[Subject]", emailContent.Name.ToUpper());
			mailText = mailText.Replace("[EmailBody]", emailContent.EmailBody);

			var documentPath = Path.Combine(_fileRootFolder!, "client_profile", taf.ApproverDetail.Department.Id.ToString(), "taf", "TAF-" + taf.ApproverDetail.Department + "-" + taf.Id + ".pdf");

			var emailDto = new EmailDto()
			{
				SentTo = [taf.ApproverDetail.Email],
				SendCc = emailContent.Cc.HasValue() ? emailContent.Cc.Split(",").ToList() : null,
				Body = mailText,
				Subject = emailContent.Subject,
				Attachment =  new List<string>{ documentPath }
			};


			await emailService.SendEmailAsyncNew(emailDto);



		}
	}
}
