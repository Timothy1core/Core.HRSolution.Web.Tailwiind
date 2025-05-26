using HRIS.Service.API.Core.Models.CurrentService.Dto.EmployeeDependent;
using HRIS.Service.API.Core.Repositories.CurrentService.Tables;
using HRSolutionDbLibrary.Core.Entities.hris.Tables;
using HRSolutionDbLibrary.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace HRIS.Service.API.Persistence.Repositories.CurrentService.Tables
{
	public class EmployeeDependentRepository(HrisDbContext context) : IEmployeeDependentRepository
	{
		public async Task SaveEmployeeDependent(EmployeeDependent employeeDependents)
		{
			await context.EmployeeDependents.AddAsync(employeeDependents);
		}
		public async Task UpdateEmployeeDependent(EmployeeDependent employeeDependentDto)
		{
			var employeeDependent = await context.EmployeeDependents.FirstOrDefaultAsync(x => x.EmployeeId == employeeDependentDto.EmployeeId);

			if (employeeDependent != null)
			{
				employeeDependent.FirstName = employeeDependentDto.FirstName;
				employeeDependent.LastName = employeeDependentDto.LastName;
				employeeDependent.MemberCode = employeeDependentDto.MemberCode;
				employeeDependent.BirthDate = employeeDependentDto.BirthDate;
				employeeDependent.Effectivity = employeeDependentDto.Effectivity;
			}
		}

		public async Task<List<EmployeeDependentDto>> RetrieveEmployeeDependent(string employeeId)
		{
			var employeeDependent = await context.EmployeeDependents
				.Where(w => w.EmployeeId == employeeId)
				.Select(s => new EmployeeDependentDto
				{
					FirstName = s.FirstName,
					LastName = s.LastName,
					MemberCode = s.MemberCode,
					BirthDate = s.BirthDate,
					Effectivity = s.Effectivity,
				})
				.ToListAsync();
			return employeeDependent!;
		}
	}
}
