namespace HRIS.Service.API.Core.Helpers;

public interface IEmailAutomationHelper
{
	Task SendExportCostingPassword(int costingPassword, string email, string firstName);
}