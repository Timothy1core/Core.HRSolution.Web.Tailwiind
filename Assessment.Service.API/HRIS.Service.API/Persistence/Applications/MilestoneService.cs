using HRIS.Service.API.Core.Applications;
using HRIS.Service.API.Core.Repositories.CurrentService.Tables;
using HRIS.Service.API.Persistence.UnitOfWork;

namespace HRIS.Service.API.Persistence.Applications
{
	public class MilestoneService(
		IUoWForCurrentService uoWForCurrentService) : IMilestoneService
	{
		private readonly IUoWForCurrentService _uoWForCurrentService = uoWForCurrentService;


		public async Task CheckAndAddTodayMilestonesAsync()
		{
			var today = DateTime.Today;
			var employees = await _uoWForCurrentService.EmployeeRepository.GetAllAsync();

			foreach (var emp in employees)
			{
				var dateHired = emp.DateHired.Date;

				// First day with CORE
				if (dateHired == today)
					await _uoWForCurrentService.EmployeeRepository.AddMilestoneAsync(emp.EmployeeId, "FIRST DAY WITH CORE", today);

				// Birthday
				if (emp.DateOfBirth.Month == today.Month &&
					emp.DateOfBirth.Day == today.Day)
				{
					await _uoWForCurrentService.EmployeeRepository.AddMilestoneAsync(emp.EmployeeId, "HAPPY BIRTHDAY", today);
				}

				// Monthly Milestones
				if (dateHired.Day == today.Day)
				{
					var months = ((today.Year - dateHired.Year) * 12) + today.Month - dateHired.Month;

					var milestoneTitle = months switch
					{
						1 => "1ST MONTH WITH CORE",
						3 => "3RD MONTH WITH CORE",
						6 => "6TH MONTH WITH CORE",
						9 => "9TH MONTH WITH CORE",
						12 => "ANNIVERSARY WITH CORE",
						_ => null
					};

					if (milestoneTitle != null)
						await _uoWForCurrentService.EmployeeRepository.AddMilestoneAsync(emp.EmployeeId, milestoneTitle, today);
				}
			}
		}
	}
}
