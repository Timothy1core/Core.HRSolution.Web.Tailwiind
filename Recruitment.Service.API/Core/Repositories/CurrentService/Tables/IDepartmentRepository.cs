
﻿using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;
 using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Department;

namespace Recruitment.Service.API.Core.Repositories.CurrentService.Tables;

public interface IDepartmentRepository
{
	Task<List<DropDownValueDto>> SelectDepartmentDropDown();
	Task<List<DropDownValueDto>> SelectDepartmentIndividualDropDown(int id);
	Task CreateDepartment(Department clientCompany);
	Task<List<DepartmentProfileDashboardDto>> RetrieveDepartmentProfileDashboard(int groupId, int serviceId, int statusId);
	Task<DepartmentInformationDto> RetrieveDepartmentProfileInfo(int departmentId);
	Task UpdateDepartment(int id,DepartmentRequestDto department);
	Task CreateDepartmentIndividual(List<DepartmentIndividual> departmentProfile);
	Task<List<DepartmentIndividualDto>> RetrieveDepartmentIndividuals(int companyId);
	Task UpdateDepartmentIndividual(DepartmentIndividualDto departmentIndividual);
}