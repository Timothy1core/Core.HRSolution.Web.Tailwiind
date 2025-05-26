using EmailServiceLibrary;
using EmailServiceLibrary.Core.Model.Dto;
using HRIS.Service.API.Core.Helpers;
using HRIS.Service.API.Persistence.UnitOfWork;

namespace HRIS.Service.API.Persistence.Helpers
{
	public class EmailAutomationHelper
	(
		IWebHostEnvironment webHostEnvironment,
		IConfiguration configuration, 
		IEmailService emailService,
		IUoWForCurrentService uoWForCurrentService
	) : IEmailAutomationHelper
	{

		private readonly IEmailService _emailService = emailService;
		private readonly IUoWForCurrentService _uniForCurrentService = uoWForCurrentService;
		private readonly string? _fileRootFolder = webHostEnvironment.IsDevelopment() ? webHostEnvironment.ContentRootPath : configuration.GetSection("baseFileLocation").Value;

		public async Task SendExportCostingPassword(int costingPassword,string email,string firstName)
		{
			var emailTemplatePath = Path.Combine(_fileRootFolder ?? string.Empty, "document_template", "EmailTemplate.html");

			var str = new StreamReader(emailTemplatePath);
			var mailText = str.ReadToEnd();
			str.Close();


			mailText = mailText.Replace("[EmailTo]", "Hi " + $"{firstName}");
			mailText = mailText.Replace("[Subject]","Employee Costing Password");
			mailText = mailText.Replace("[EmailBody]", "<p>Please find below the password for the employee costing Excel file that was shared with you:</p>" +
			                                           "<p style='text-align:center;' data-start='314' data-end='352'> <strong>Password:</strong>&nbsp;</p>" +
			                                           "<p style='text-align:center;' data-start='314' data-end='352'> <span style='font-size:26px;'><strong>"+ costingPassword + "</strong></span></p>" +
			                                           "<p data-start='354' data-end='534'>Kindly ensure that this password is kept confidential and only shared with authorized personnel. If you encounter any issues accessing the file, please don’t hesitate to reach out.</p>");


			var emailDto = new EmailDto()
			{
				SentTo = [email],
				SendCc = ["jomari.mananghaya@onecoredevit.com"],
				Body = mailText,
				Subject = "Password for Employee Costing Excel File"
			};



			await emailService.SendEmailAsyncNew(emailDto);
		}
	}
}
