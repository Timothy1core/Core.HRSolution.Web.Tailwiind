using HRIS.Service.API.Core.Models.CurrentService.Dto.Employee;
using System.Collections.Generic;
using System.Threading.Tasks;
using HRSolutionDbLibrary.Core.Entities.hris.Tables;

namespace HRIS.Service.API.Core.Repositories.CurrentService.Tables
{
	public interface IEmployeeRepository
	{
		Task<List<EmployeeDashboardDto>> RetrieveEmployeeDashboardList();
		Task<EmployeeProfileDto> RetrieveEmployeeProfile(string employeeId);
		Task<PersonalDetailsDto> RetrievePersonalDetails(string employeeId);
		Task<WorkDetailsDto> RetrieveWorkDetails(string employeeId);
		Task UpdatePersonalDetails(EmployeeInformation personalDetailsDto);
		Task UpdateWorkDetails(EmployeeInformation workDetailsDto);
		Task UpdateEmployeeMedicard(EmployeeInformation employeeMedicardDto);
		Task<IEnumerable<EmployeeInformation>> GetAllAsync();
		Task AddMilestoneAsync(string employeeId, string description, DateTime date);
		Task<List<EmployeeMilestone>> RetrieveCoreMilestones(string employeeId);
    
		#region costing

		Task UpdateCostingDetails(CostingDetailsDto costingDetailsDto);
		Task<CostingDetailsDto> RetrieveCostingDetails(string employeeId);
		Task<List<CostingDashboardDto>> RetrieveCostingList(int departmentId, int teamId);

		#endregion

		Task<EmployeeInformation> RetrieveEmployeeInformation(string employeeId);
	}
}
