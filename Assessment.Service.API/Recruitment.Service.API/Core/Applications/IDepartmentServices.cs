using Microsoft.AspNetCore.Mvc;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Department;
using System.Threading.Tasks;

namespace Recruitment.Service.API.Core.Applications;

public interface IDepartmentServices
{
	Task<(bool IsSuccess, string Message)> CreateDepartment(DepartmentRequestDto department, string loggedEmployee);
	Task<(bool IsSuccess, string Message, List<DepartmentProfileDashboardDto> DashboardDtos)> RetrieveDepartmentDashboard(int groupId, int serviceId, int statusId);
	Task<(bool IsSuccess, string Message, DepartmentInformationDto departmentInformation)> RetrieveDepartmentInfo(int id);
	Task<(bool IsSuccess, string Message)> UpdateDepartment(int id,DepartmentRequestDto department);

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

	Task<(bool IsSuccess, string Message, List<DropDownValueDto> DropDownValueDto)> RetrieveDepartmentIndustryDropDown();
	Task<(bool IsSuccess, string Message, List<DropDownValueDto> DropDownValueDto)> RetrieveDepartmentTimeZoneDropDown();

}