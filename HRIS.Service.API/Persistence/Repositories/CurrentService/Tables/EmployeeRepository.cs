using HRApplicationDbLibrary.Persistence.DbContexts;
using HRIS.Service.API.Core.Models.CurrentService.Dto.Employee;
using HRIS.Service.API.Core.Repositories.CurrentService.Tables;
using HRSolutionDbLibrary.Core.Entities.Tables;
using HRSolutionDbLibrary.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using System.Runtime.Intrinsics.X86;
using System.Text.RegularExpressions;
using EncryptionLibrary;

namespace HRIS.Service.API.Persistence.Repositories.CurrentService.Tables
{
	public class EmployeeRepository(CurrentServiceDbContext context) : IEmployeeRepository
	{
		public async Task<List<EmployeeDashboardDto>> RetrieveEmployeeDashboardList()
		{
			var employeeList = await context.EmployeeInformations
				.Include(i => i.Department)
				.ThenInclude(i => i.DepartmentGroup)
				.Select(s => new EmployeeDashboardDto()
				{
					EmployeeId = s.EmployeeId,
					EmployeeName = s.FirstName + " " + s.LastName,
					DateHired = s.DateHired,
					RegularizationDate = s.RegularizationDate,
					Status = s.EmploymentStatus,
					Group = s.Department.DepartmentGroup.GroupName,
					Department = s.Department.Name,
					Position = s.Position
				})
				.ToListAsync();

			return employeeList;
		}

		public async Task<EmployeeProfileDto> RetrieveEmployeeProfile(string employeeId)
		{
			var employeeProfile = await context.EmployeeInformations
				.Include(i => i.Department)
				.Where(w => w.EmployeeId == employeeId)
				.Select(s => new EmployeeProfileDto
				{
					EmployeeName = s.FirstName + " " + s.LastName,
					Position = s.Position,
					EmployeeId = s.DateHired.Year + " - " + int.Parse(s.EmployeeId).ToString("D4"),
					DepartmentName = s.Department.Name,
					DateHired = s.DateHired,
					RegularizationDate = s.RegularizationDate,
					EmploymentStatus = s.EmploymentStatus
				})
				.FirstOrDefaultAsync();
			return employeeProfile!;
		}

		public async Task<PersonalDetailsDto> RetrievePersonalDetails(string employeeId)
		{
			var personalDetails = await context.EmployeeInformations
				.Include(i => i.Department)
				.Where(w => w.EmployeeId == employeeId)
				.Select(s => new PersonalDetailsDto
				{
					FirstName = s.FirstName,
					MiddleName = s.MiddleName,
					LastName = s.LastName,
					MiddleNamePrefix = s.MiddleNamePrefix,
					Salutation = s.Salutation,
					Gender = s.Gender,
					DateOfBirth = s.DateOfBirth,
					CivilStatus = s.CivilStatus,
					EducationalAttainment = s.EducationalAttainment,
					CurrentAddress = s.CurrentAddress,
					CurrentCityProvince = s.CurrentCityProvince,
					CurrentLocation = s.CurrentLocation,
					CurrentZipcode = s.CurrentZipcode,
					PermanentAddress = s.PermanentAddress,
					PermanentCityProvince = s.PermanentCityProvince,
					PermanentLocation = s.PermanentLocation,
					PermanentZipcode = s.PermanentZipcode,
					LandlineNo = s.LandlineNo,
					MobileNo = s.MobileNo,
					AlternativeMobileNo = s.AlternativeMobileNo,
					PersonalEmail = s.PersonalEmail,
					EmergencyContactPerson = s.EmergencyContactPerson,
					EmergencyContactNo = s.EmergencyContactNo,
					EmergencyRelation = s.EmergencyRelation
				})
				.FirstOrDefaultAsync();
			return personalDetails!;
		}
		public async Task<WorkDetailsDto> RetrieveWorkDetails(string employeeId)
		{
			var workDetails = await context.EmployeeInformations
				.Include(i => i.Department)
				.ThenInclude(i => i.DepartmentGroup)
				.Where(w => w.EmployeeId == employeeId)
				.Select(s => new WorkDetailsDto
				{
					DateHired = s.DateHired,
					RegularizationDate = s.RegularizationDate,
					EmploymentStatus = s.EmploymentStatus,
					ContractType = s.ContractType,
					Position = s.Position,
					ImmediateSuperior = s.ImmediateSuperior,
					EmployeeLevel = s.EmployeeLevel,
					CompanyEmail = s.CompanyEmail,
					DepartmentGroup = s.Department.DepartmentGroup.GroupName,
					Department = s.DepartmentId,
					TeamId = s.TeamId,
					LocationId = s.LocationId,
					Sss = s.Sss,
					Philhealth = s.Philhealth,
					Tin = s.Tin,
					Pagibig = s.Pagibig,
					Bank = s.Bank,
					BankBranch = s.BankBranch,
					BankAccount = s.BankAccount,
					ScheduleTypeId = s.ScheduleTypeId,
					WorkHours = s.WorkHours,
					WorkSetup = s.WorkSetup,
					HasPerfectAttendance = s.HasPerfectAttendance,
					SeparationDate = s.SeparationDate,
					ClearedDate = s.ClearedDate,
					LastPayReleaseDate = s.LastPayReleaseDate,
					Remarks = s.Remarks,
					ReasonForLeaving = s.ReasonForLeaving,
					IsActive = s.IsActive,
				})
				.FirstOrDefaultAsync();
			return workDetails!;
		}

		public async Task UpdatePersonalDetails(EmployeeInformation personalDetailsDto)
		{
			var employeeInformation = await context.EmployeeInformations.FirstOrDefaultAsync(x => x.EmployeeId == personalDetailsDto.EmployeeId);

			if (employeeInformation != null)
			{
				employeeInformation.FirstName = personalDetailsDto.FirstName;
				employeeInformation.MiddleName = personalDetailsDto.MiddleName;
				employeeInformation.LastName = personalDetailsDto.LastName;
				employeeInformation.MiddleNamePrefix = personalDetailsDto.MiddleNamePrefix;
				employeeInformation.Salutation = personalDetailsDto.Salutation;
				employeeInformation.Gender = personalDetailsDto.Gender;
				employeeInformation.DateOfBirth = personalDetailsDto.DateOfBirth;
				employeeInformation.CivilStatus = personalDetailsDto.CivilStatus;
				employeeInformation.EducationalAttainment = personalDetailsDto.EducationalAttainment;
				employeeInformation.CurrentAddress = personalDetailsDto.CurrentAddress;
				employeeInformation.CurrentCityProvince = personalDetailsDto.CurrentCityProvince;
				employeeInformation.CurrentLocation = personalDetailsDto.CurrentLocation;
				employeeInformation.CurrentZipcode = personalDetailsDto.CurrentZipcode;
				employeeInformation.PermanentAddress = personalDetailsDto.PermanentAddress;
				employeeInformation.PermanentCityProvince = personalDetailsDto.PermanentCityProvince;
				employeeInformation.PermanentLocation = personalDetailsDto.PermanentLocation;
				employeeInformation.PermanentZipcode = personalDetailsDto.PermanentZipcode;
				employeeInformation.LandlineNo = personalDetailsDto.LandlineNo;
				employeeInformation.MobileNo = personalDetailsDto.MobileNo;
				employeeInformation.AlternativeMobileNo = personalDetailsDto.AlternativeMobileNo;
				employeeInformation.PersonalEmail = personalDetailsDto.PersonalEmail;
				employeeInformation.EmergencyContactPerson = personalDetailsDto.EmergencyContactPerson;
				employeeInformation.EmergencyContactNo = personalDetailsDto.EmergencyContactNo;
				employeeInformation.EmergencyRelation = personalDetailsDto.EmergencyRelation;
			}
		}

		public async Task UpdateWorkDetails(EmployeeInformation workDetailsDto)
		{
			var employeeInformation = await context.EmployeeInformations.FirstOrDefaultAsync(x => x.EmployeeId == workDetailsDto.EmployeeId);

			if (employeeInformation != null)
			{
				employeeInformation.DateHired = workDetailsDto.DateHired;
				employeeInformation.RegularizationDate = workDetailsDto.RegularizationDate;
				employeeInformation.EmploymentStatus = workDetailsDto.EmploymentStatus;
				employeeInformation.ContractType = workDetailsDto.ContractType;
				employeeInformation.Position = workDetailsDto.Position;
				employeeInformation.ImmediateSuperior = workDetailsDto.ImmediateSuperior;
				employeeInformation.EmployeeLevel = workDetailsDto.EmployeeLevel;
				employeeInformation.CompanyEmail = workDetailsDto.CompanyEmail;
				employeeInformation.DepartmentId = workDetailsDto.DepartmentId;
				employeeInformation.TeamId = workDetailsDto.TeamId;
				employeeInformation.LocationId = workDetailsDto.LocationId;
				employeeInformation.Sss = workDetailsDto.Sss;
				employeeInformation.Philhealth = workDetailsDto.Philhealth;
				employeeInformation.Tin = workDetailsDto.Tin;
				employeeInformation.Pagibig = workDetailsDto.Pagibig;
				employeeInformation.Bank = workDetailsDto.Bank;
				employeeInformation.BankBranch = workDetailsDto.BankBranch;
				employeeInformation.BankAccount = workDetailsDto.BankAccount;
				employeeInformation.ScheduleTypeId = workDetailsDto.ScheduleTypeId;
				employeeInformation.WorkHours = workDetailsDto.WorkHours;
				employeeInformation.WorkSetup = workDetailsDto.WorkSetup;
				employeeInformation.HasPerfectAttendance = workDetailsDto.HasPerfectAttendance;
				employeeInformation.SeparationDate = workDetailsDto.SeparationDate;
				employeeInformation.ClearedDate = workDetailsDto.ClearedDate;
				employeeInformation.LastPayReleaseDate = workDetailsDto.LastPayReleaseDate;
				employeeInformation.Remarks = workDetailsDto.Remarks;
				employeeInformation.ReasonForLeaving = workDetailsDto.ReasonForLeaving;
				employeeInformation.IsActive = workDetailsDto.IsActive;
			}
		}
		public async Task UpdateEmployeeMedicard(EmployeeInformation employeeMedicardDto)
		{
			var employeeInformation = await context.EmployeeInformations.FirstOrDefaultAsync(x => x.EmployeeId == employeeMedicardDto.EmployeeId);

			if (employeeInformation != null)
			{
				employeeInformation.MedicardId = employeeMedicardDto.MedicardId;
				employeeInformation.MedicardEffectivity = employeeMedicardDto.MedicardEffectivity;
			}
		}

		public async Task<IEnumerable<EmployeeInformation>> GetAllAsync()
		{
			return await context.EmployeeInformations.ToListAsync();
		}

		public async Task AddMilestoneAsync(string employeeId, string description, DateTime date)
		{
			var exists = await context.EmployeeMilestones.AnyAsync(m =>
				m.EmployeeId == employeeId && m.Description == description && m.Date == date);

			if (!exists)
			{
				context.EmployeeMilestones.Add(new EmployeeMilestone
				{
					EmployeeId = employeeId,
					Description = description,
					Date = date
				});

				await context.SaveChangesAsync();
			}


		}

		public async Task<List<EmployeeMilestone>> RetrieveCoreMilestones(string employeeId)
		{
			var coreMilestones = await context.EmployeeMilestones
				.Where(w => w.EmployeeId == employeeId)
				.Select(s => new EmployeeMilestone
				{
					Description = s.Description,
					Date = s.Date,
				})
				.ToListAsync();
			return coreMilestones!;
		}

		#region costing

		private static string DecryptOrDefault(string encryptedValue) => string.IsNullOrEmpty(encryptedValue) ? "0.00" : EncryptionServices.Decrypt(encryptedValue);

		public async Task UpdateCostingDetails(CostingDetailsDto costingDetailsDto)
		{
			var costingInformation = await context.EmployeeInformations.FirstOrDefaultAsync(x => x.EmployeeId == costingDetailsDto.EmployeeId);


			if (costingInformation != null)
			{
				costingInformation.BasicPay = EncryptionServices.Encrypt(costingDetailsDto.BasicPay);
				costingInformation.Deminimis = EncryptionServices.Encrypt(costingDetailsDto.Deminimis);
				costingInformation.MealAllowance = EncryptionServices.Encrypt(costingDetailsDto.MealAllowance);
				costingInformation.RiceAllowance = EncryptionServices.Encrypt(costingDetailsDto.RiceAllowance);
				costingInformation.ClothingAllowance = EncryptionServices.Encrypt(costingDetailsDto.ClothingAllowance);
				costingInformation.LaundryAllowance = EncryptionServices.Encrypt(costingDetailsDto.LaundryAllowance);
				costingInformation.MedicalCashAllowance = EncryptionServices.Encrypt(costingDetailsDto.MedicalCashAllowance);
				costingInformation.TaxableAllowance = EncryptionServices.Encrypt(costingDetailsDto.TaxableAllowance);

			} 
		}

		public async Task<CostingDetailsDto> RetrieveCostingDetails(string employeeId)
		{
			var costingDetails = await context.EmployeeInformations
				.Include(i => i.Department)
				.ThenInclude(i => i.DepartmentGroup)
				.Where(w => w.EmployeeId == employeeId)
				.Select(s => new CostingDetailsDto
				{
					EmployeeId = s.EmployeeId,
					BasicPay = DecryptOrDefault(s.BasicPay),
					Deminimis = DecryptOrDefault(s.Deminimis),
					MealAllowance = DecryptOrDefault(s.MealAllowance),
					RiceAllowance = DecryptOrDefault(s.RiceAllowance),
					ClothingAllowance = DecryptOrDefault(s.ClothingAllowance),
					LaundryAllowance = DecryptOrDefault(s.LaundryAllowance),
					MedicalCashAllowance = DecryptOrDefault(s.MedicalCashAllowance),
					TaxableAllowance = DecryptOrDefault(s.TaxableAllowance),
				})
				.FirstOrDefaultAsync();
			return costingDetails!;
		}

		public async Task<List<CostingDashboardDto>> RetrieveCostingList(int departmentId, int teamId)
		{
			var costingListQuery = context.EmployeeInformations
				.Include(i => i.Department)
				.ThenInclude(i => i.DepartmentGroup)
				.Where(w=> w.IsActive==true);

			costingListQuery = departmentId == 0 ? costingListQuery : costingListQuery.Where(w => w.DepartmentId == departmentId);
			costingListQuery = teamId == 0 ? costingListQuery : costingListQuery.Where(w => w.TeamId == teamId);


			var costingList = await costingListQuery.Select(s => new CostingDashboardDto
			{
				EmployeeId = s.EmployeeId,
				YearId = s.YearId,
				FirstName = s.FirstName,
				LastName = s.LastName,
				DepartmentGroupName = s.Department.DepartmentGroup.GroupName,
				DepartmentName = s.Department.Name,
				BasicPay = DecryptOrDefault(s.BasicPay),
				Deminimis = DecryptOrDefault(s.Deminimis),
				MealAllowance = DecryptOrDefault(s.MealAllowance),
				RiceAllowance = DecryptOrDefault(s.RiceAllowance) ,
				ClothingAllowance = DecryptOrDefault(s.ClothingAllowance),
				LaundryAllowance = DecryptOrDefault(s.LaundryAllowance),
				MedicalCashAllowance = DecryptOrDefault(s.MedicalCashAllowance),
				TaxableAllowance = DecryptOrDefault(s.TaxableAllowance),
			}).ToListAsync();


			return costingList;
		}
		#endregion

		public async Task<EmployeeInformation> RetrieveEmployeeInformation(string employeeId)
		{
			var employeeProfile = await context.EmployeeInformations
				.Where(w => w.EmployeeId == employeeId)
				.FirstOrDefaultAsync();
			return employeeProfile!;
		}
	}
}
