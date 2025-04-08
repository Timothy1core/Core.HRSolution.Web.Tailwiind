using HRSolutionDbLibrary.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Department;
using Recruitment.Service.API.Core.Repositories.CurrentService.Tables;

namespace Recruitment.Service.API.Persistence.Repositories.CurrentService.Tables
{
	public class DepartmentRepository(CurrentServiceDbContext context) : IDepartmentRepository
	{
		public async Task<List<DropDownValueDto>> SelectDepartmentDropDown()
		{
			var departments = await context.Departments
				.Where(x => x.IsActive)
				.Select(s => new DropDownValueDto()
				{
					Id = s.Id,
					Value = s.Id.ToString(),
					Label = s.Name
				})
				.ToListAsync();

			return departments;

		}
		public async Task<List<DropDownValueDto>> SelectDepartmentIndividualDropDown(int id)
		{
			var individuals = await context.DepartmentIndividuals
				.Where(x => x.IsActive && x.DepartmentId==id)
				.Select(s => new DropDownValueDto()
				{
					Id = s.Id,
					Value = s.Id.ToString(),
					Label = s.Name
				})
				.ToListAsync();

			return individuals;
		}

		public async Task CreateDepartment(Department department)
		{
			await context.Departments.AddAsync(department);
		}

		public async Task<List<DepartmentProfileDashboardDto>> RetrieveDepartmentProfileDashboard(int groupId, int serviceId, int statusId)
		{
			var profiles = await context.Departments
				.Where(x => x.IsActive)
				.Include(i => i.CoreService)
				.Include(i => i.DepartmentGroup)
				.Include(i => i.DepartmentStatus)
				.ToListAsync();


			profiles = serviceId == 0 ? profiles.ToList() : profiles.Where(x => x.CoreServiceId == serviceId).ToList();
			profiles = statusId == 0 ? profiles.ToList() : profiles.Where(x => x.DepartmentStatusId == statusId).ToList();
			profiles = groupId == 0 ? profiles.ToList() : profiles.Where(x => x.DepartmentGroupId == groupId).ToList();

			var profileDtos = profiles.Select(s => new DepartmentProfileDashboardDto()
				{
					Id = s.Id,
					Logo = s.Logo,
					Name = s.Name,
					Industry = s.Industry,
					CoreService = s.CoreService.Service,
					Status = s.DepartmentStatus.Status,
					ComanyGroup = s.DepartmentGroup.GroupName
				})
				.ToList();

			return profileDtos;

		}

		public async Task<DepartmentInformationDto> RetrieveDepartmentProfileInfo(int departmentId)
		{
			var profile = await context.Departments
				.Include(i=> i.DepartmentIndividuals)
				.Include(i=> i.JobProfiles)
				.Select(s=> new DepartmentInformationDto()
				{
					Id = s.Id,
					Logo = s.Logo,
					Name = s.Name,
					Alias = s.Alias,
					Industry = s.Industry,
					Timezone = s.Timezone,
					TimezoneOffset = s.TimezoneOffset,
					Website = s.Website,
					DepartmentStatusId = s.DepartmentStatusId,
					CoreServiceId = s.CoreServiceId,
					DepartmentStatus = s.DepartmentStatus.Status,
					CoreService = s.CoreService.Service
				})
				.AsNoTracking()
				.FirstOrDefaultAsync(x => x.Id== departmentId);
				
			return profile!;

		}

		public async Task UpdateDepartment(int id,DepartmentRequestDto department)
		{
			

			var departmentInfo = await context.Departments.FirstOrDefaultAsync(x=> x.Id== id);

			if (departmentInfo != null)
			{
				departmentInfo.Name = department.Name;
				departmentInfo.Industry = department.Industry;
				departmentInfo.Alias = department.Alias;
				departmentInfo.Website = department.Website;
				departmentInfo.Timezone = department.Timezone;
				departmentInfo.TimezoneOffset = department.TimezoneOffset;
				departmentInfo.CoreServiceId = department.CoreServiceId;
				departmentInfo.DepartmentStatusId = department.DepartmentStatusId;
				departmentInfo.Logo = department.Logo == null? departmentInfo.Logo : department.Logo.FileName;

			}
		}

		public async Task CreateDepartmentIndividual(List<DepartmentIndividual> departmentProfile)
		{
			await context.DepartmentIndividuals.AddRangeAsync(departmentProfile);
		}

		public async Task<List<DepartmentIndividualDto>> RetrieveDepartmentIndividuals(int departmentId)
		{

			var departmentIndividuals = await context.DepartmentIndividuals
				.Where(x=> x.DepartmentId == departmentId)
				.Select(s => new DepartmentIndividualDto()
			{
				Id = s.Id,
				Name = s.Name,
				Position = s.Position,
				Email = s.Email
			}).ToListAsync();

			return departmentIndividuals;
		}

		public async Task UpdateDepartmentIndividual(DepartmentIndividualDto departmentIndividual)
		{
			var individual = await context.DepartmentIndividuals.FindAsync(departmentIndividual.Id);

			if (individual != null)
			{
				individual.Name = departmentIndividual.Name;
				individual.Position = departmentIndividual.Position;
				individual.Email = departmentIndividual.Email;
			}
		}


	}
}
