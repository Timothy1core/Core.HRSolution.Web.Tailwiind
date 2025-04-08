using Microsoft.AspNetCore.Mvc;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Department;

namespace Recruitment.Service.API.Core.Applications;

public interface IDepartmentServices
{
	Task<JsonResult> CreateDepartment(DepartmentRequestDto department, string loggedEmployee);
	Task<JsonResult> RetrieveDepartmentDashboard(int groupId, int serviceId, int statusId);
	Task<JsonResult> RetrieveDepartmentInfo(int id);
	Task<JsonResult> UpdateDepartment(int id,DepartmentRequestDto department);

	Task<JsonResult> CreateDepartmentIndividuals(int companyId, List<DepartmentIndividualDto> clientIndividuals);
	Task<JsonResult> RetrieveDepartmentIndividualDashboard(int clientCompanyId);

	Task<JsonResult> UpdateDepartmentIndividual(int id, DepartmentIndividualDto departmentIndividual);

	
	Task<(string filePath, string contentType)> RetrieveDepartmentLogo(int companyId);
	Task<JsonResult> RetrieveCoreServicesDropDown();
	Task<JsonResult> RetrieveDepartmentStatusDropDown();

	Task<JsonResult> RetrieveDepartmentDropDown();
	Task<JsonResult> RetrieveEmploymentDropDown();
	Task<JsonResult> RetrieveJobStatusDropDown();

	Task<JsonResult> DepartmentGroupDropDown();
	Task<JsonResult> DepartmentIndividualDropDown(int id);
	Task<JsonResult> DepartmentJobProfileDropDown(int id);

}