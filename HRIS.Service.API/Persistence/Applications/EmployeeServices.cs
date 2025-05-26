using HRIS.Service.API.Core.Applications;
using HRIS.Service.API.Core.Models.CurrentService.Dto.Employee;
using HRIS.Service.API.Persistence.UnitOfWork;
using Microsoft.AspNetCore.Mvc;
using System.Linq.Dynamic.Core;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using HRIS.Service.API.Core.Helpers;
using HRIS.Service.API.Core.Models.CurrentService.Dto;
using LicenseContext = OfficeOpenXml.LicenseContext;

namespace HRIS.Service.API.Persistence.Applications
{
	public class EmployeeServices(
		IUoWForCurrentService uoWForCurrentService,
		IEmailAutomationHelper emailAutomationHelper,
		ILogger<EmployeeServices> logger
	) : IEmployeeServices
	{
		private readonly IUoWForCurrentService _uoWForCurrentService = uoWForCurrentService;
		private readonly IEmailAutomationHelper _emailAutomation = emailAutomationHelper;
		private readonly ILogger<EmployeeServices> _logger = logger;
		public async Task<JsonResult> RetrieveAllEmployeeService(string? search, int start, int length,
			string draw, string sortColumnName, string sortDirection)
		{
			JsonResult result;
			try
			{
				var employees =
					await _uoWForCurrentService.EmployeeRepository.RetrieveEmployeeDashboardList();


				var totalRows = employees.Count;

				// Apply search filter
				if (!string.IsNullOrEmpty(search))
				{
					employees = employees.Where(x =>
						(x.EmployeeName?.ToLower().Contains(search.ToLower()) ?? false)).ToList();
				}

				var totalRowsAfterFiltering = employees.Count;

				// Apply sorting
				employees = employees.AsQueryable()
					.OrderBy(sortColumnName + " " + sortDirection)
					.ToList();



				// Apply pagination
				if (length != -1)
				{
					employees = employees.Skip(start).Take(length).ToList();
				}

				// Prepare result
				result = new JsonResult(new
				{
					data = employees,
					draw,
					recordsTotal = totalRows,
					recordsFiltered = totalRowsAfterFiltering,
				})
				{
					StatusCode = 200
				};

				return result;
			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving employees: {e.Message}");

				result = new JsonResult(new
				{
					success = false,
					responseText = $"Error occurred while retrieving employees: {e.Message}"
				})
				{
					StatusCode = 400
				};
				return result;
			}
		}

		public async Task<JsonResult> RetrieveEmployeeInfoService(string employeeId)
		{
			JsonResult result;
			try
			{

				var employeeProfile = await _uoWForCurrentService.EmployeeRepository.RetrieveEmployeeProfile(employeeId);
				var personalDetails = await _uoWForCurrentService.EmployeeRepository.RetrievePersonalDetails(employeeId);
				var workDetails = await _uoWForCurrentService.EmployeeRepository.RetrieveWorkDetails(employeeId);
				var milestones = await _uoWForCurrentService.EmployeeRepository.RetrieveCoreMilestones(employeeId);
				var dependents = await _uoWForCurrentService.EmployeeDependentRepository.RetrieveEmployeeDependent(employeeId);

				result = new JsonResult(new { employeeProfile, personalDetails, workDetails, milestones, dependents })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving employee: {e.Message}");

				result = new JsonResult(new
				{ success = false, responseText = $"Error occurred while retrieving employee: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> UpdatePersonalDetailsService(string employeeId,
			PersonalDetailsDto personalDetailsDto)
		{
			JsonResult result;
			try
			{
				var personalDetails = new EmployeeInformation()
				{
					EmployeeId = employeeId,
					FirstName = personalDetailsDto.FirstName,
					MiddleName = personalDetailsDto.MiddleName,
					LastName = personalDetailsDto.LastName,
					MiddleNamePrefix = personalDetailsDto.MiddleNamePrefix,
					Salutation = personalDetailsDto.Salutation,
					Gender = personalDetailsDto.Gender,
					DateOfBirth = personalDetailsDto.DateOfBirth,
					CivilStatus = personalDetailsDto.CivilStatus,
					EducationalAttainment = personalDetailsDto.EducationalAttainment,
					CurrentAddress = personalDetailsDto.CurrentAddress,
					CurrentCityProvince = personalDetailsDto.CurrentCityProvince,
					CurrentLocation = personalDetailsDto.CurrentLocation,
					CurrentZipcode = personalDetailsDto.CurrentZipcode,
					PermanentAddress = personalDetailsDto.PermanentAddress,
					PermanentCityProvince = personalDetailsDto.PermanentCityProvince,
					PermanentLocation = personalDetailsDto.PermanentLocation,
					PermanentZipcode = personalDetailsDto.PermanentZipcode,
					LandlineNo = personalDetailsDto.LandlineNo,
					MobileNo = personalDetailsDto.MobileNo,
					AlternativeMobileNo = personalDetailsDto.AlternativeMobileNo,
					PersonalEmail = personalDetailsDto.PersonalEmail,
					EmergencyContactPerson = personalDetailsDto.EmergencyContactPerson,
					EmergencyContactNo = personalDetailsDto.EmergencyContactNo,
					EmergencyRelation = personalDetailsDto.EmergencyRelation
				};
				await _uoWForCurrentService.EmployeeRepository.UpdatePersonalDetails(personalDetails);
				await _uoWForCurrentService.CommitAsync();

				result = new JsonResult(new { success = true, responseText = "Personal Details Successfully Updated" })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while updating personal details: {e.Message}");

				result = new JsonResult(new
				{
					success = false,
					responseText = $"Error occurred while updating personal details: {e.Message}"
				})
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> UpdateWorkDetailsService(string employeeId,
			WorkDetailsDto workDetailsDto)
		{
			JsonResult result;
			try
			{
				var workDetails = new EmployeeInformation()
				{
					EmployeeId = employeeId,
					DateHired = workDetailsDto.DateHired,
					RegularizationDate = workDetailsDto.RegularizationDate,
					EmploymentStatus = workDetailsDto.EmploymentStatus,
					ContractType = workDetailsDto.ContractType,
					Position = workDetailsDto.Position,
					ImmediateSuperior = workDetailsDto.ImmediateSuperior,
					EmployeeLevel = workDetailsDto.EmployeeLevel,
					CompanyEmail = workDetailsDto.CompanyEmail,
					DepartmentId = workDetailsDto.Department,
					TeamId = workDetailsDto.TeamId,
					LocationId = workDetailsDto.LocationId,
					Sss = workDetailsDto.Sss,
					Philhealth = workDetailsDto.Philhealth,
					Tin = workDetailsDto.Tin,
					Pagibig = workDetailsDto.Pagibig,
					Bank = workDetailsDto.Bank,
					BankBranch = workDetailsDto.BankBranch,
					BankAccount = workDetailsDto.BankAccount,
					ScheduleTypeId = workDetailsDto.ScheduleTypeId,
					WorkHours = workDetailsDto.WorkHours,
					WorkSetup = workDetailsDto.WorkSetup,
					HasPerfectAttendance = workDetailsDto.HasPerfectAttendance,
					SeparationDate = workDetailsDto.SeparationDate,
					ClearedDate = workDetailsDto.ClearedDate,
					LastPayReleaseDate = workDetailsDto.LastPayReleaseDate,
					Remarks = workDetailsDto.Remarks,
					ReasonForLeaving = workDetailsDto.ReasonForLeaving,
					IsActive = workDetailsDto.IsActive
				};
				await _uoWForCurrentService.EmployeeRepository.UpdateWorkDetails(workDetails);
				await _uoWForCurrentService.CommitAsync();

				result = new JsonResult(new { success = true, responseText = "Work Details Successfully Updated" })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while updating work details: {e.Message}");

				result = new JsonResult(new
				{
					success = false,
					responseText = $"Error occurred while updating work details: {e.Message}"
				})
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> UpdateEmployeeMedicardService(string employeeId, EmployeeMedicardDto employeeMedicard)
		{
			JsonResult result;
			try
			{
				var employeeMedicardDto = new EmployeeInformation()
				{
					EmployeeId = employeeId,
					MedicardId = employeeMedicard.MedicardId,
					MedicardEffectivity = employeeMedicard.MedicardEffectivity,
				};
				await _uoWForCurrentService.EmployeeRepository.UpdateEmployeeMedicard(employeeMedicardDto);
				await _uoWForCurrentService.CommitAsync();

				result = new JsonResult(new { success = true, responseText = "Medicard Successfully Updated" })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while updating medicard: {e.Message}");

				result = new JsonResult(new
				{
					success = false,
					responseText = $"Error occurred while updating medicard: {e.Message}"
				})
				{
					StatusCode = 400
				};
				return result;

			}
		}



		#region costing

		public async Task<JsonResult> UpdateCostingDetailsService(CostingDetailsDto costingDetailsDto)
		{
			JsonResult result;
			try
			{
				var costingDetails = new CostingDetailsDto()
				{
					EmployeeId = costingDetailsDto.EmployeeId,
					BasicPay = costingDetailsDto.BasicPay,
					Deminimis = costingDetailsDto.Deminimis,
					MealAllowance = costingDetailsDto.MealAllowance,
					RiceAllowance = costingDetailsDto.RiceAllowance,
					ClothingAllowance = costingDetailsDto.ClothingAllowance,
					LaundryAllowance = costingDetailsDto.LaundryAllowance,
					MedicalCashAllowance = costingDetailsDto.MedicalCashAllowance,
					TaxableAllowance = costingDetailsDto.TaxableAllowance,

				};
				await _uoWForCurrentService.EmployeeRepository.UpdateCostingDetails(costingDetails);
				await _uoWForCurrentService.CommitAsync();

				result = new JsonResult(new { success = true, responseText = "Costing Details Successfully Updated" })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while updating costing details: {e.Message}");

				result = new JsonResult(new
				{
					success = false,
					responseText = $"Error occurred while updating costing details: {e.Message}"
				})
				{
					StatusCode = 400
				};
				return result;

			}
		}


		public async Task<JsonResult> RetrieveCostingDetailsService(string employeeId)
		{
			JsonResult result;
			try
			{

				var employeeCosting = await _uoWForCurrentService.EmployeeRepository.RetrieveCostingDetails(employeeId);

				result = new JsonResult(new
				{
					employeeCosting

				})
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving employee: {e.Message}");

				result = new JsonResult(new
				{ success = false, responseText = $"Error occurred while retrieving employee: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<ExportFileResultDto> ExportEmployeeCostingDetailsService(string loggedEmployee)
		{
			try
			{

				var rnd = new Random();
				var excelPassword = rnd.Next(); // creates a number between 0 and 51

				ExcelPackage.LicenseContext = LicenseContext.NonCommercial;


				using var package = new ExcelPackage();
				var worksheet = package.Workbook.Worksheets.Add("CORE MASTERFILE");

				// Headers
				worksheet.Cells[1, 1].Value = "EMPLOYEE ID";
				worksheet.Cells[1, 2].Value = "FULL NAME";
				worksheet.Cells[1, 3].Value = "TOTAL";
				worksheet.Cells[1, 4].Value = "BASIC PAY";
				worksheet.Cells[1, 5].Value = "DEMINIMIS";
				worksheet.Cells[1, 6].Value = "MEAL ALLOWANCE";
				worksheet.Cells[1, 7].Value = "RICE ALLOWANCE";
				worksheet.Cells[1, 8].Value = "CLOTHING ALLOWANCE";
				worksheet.Cells[1, 9].Value = "LAUNDRY ALLOWANCE";
				worksheet.Cells[1, 10].Value = "MEDICAL CASH ALLOWANCE";


				var headerCells = worksheet.Cells["A1:J1"];
				headerCells.Style.Border.Top.Style = ExcelBorderStyle.Thin;
				headerCells.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
				headerCells.Style.Border.Left.Style = ExcelBorderStyle.Thin;
				headerCells.Style.Border.Right.Style = ExcelBorderStyle.Thin;
				headerCells.Style.Font.Bold = true;

				var costingList = await _uoWForCurrentService.EmployeeRepository.RetrieveCostingList(0, 0);
				// Data
				var row = 2;
				foreach (var c in costingList)
				{
					worksheet.Cells[row, 1].Value = c.EmployeeId;
					worksheet.Cells[row, 2].Value = c.EmployeeFullName;
					worksheet.Cells[row, 3].Value = c.TotalSalary.ToString("##,###.##");
					worksheet.Cells[row, 4].Value = c.BasicPay;
					worksheet.Cells[row, 5].Value = c.Deminimis;
					worksheet.Cells[row, 6].Value = c.MealAllowance;
					worksheet.Cells[row, 7].Value = c.RiceAllowance;
					worksheet.Cells[row, 8].Value = c.ClothingAllowance;
					worksheet.Cells[row, 9].Value = c.LaundryAllowance;
					worksheet.Cells[row, 10].Value = c.MedicalCashAllowance;

					var rowCells = worksheet.Cells[row, 1, row, 10];
					rowCells.Style.Border.Top.Style = ExcelBorderStyle.Thin;
					rowCells.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
					rowCells.Style.Border.Left.Style = ExcelBorderStyle.Thin;
					rowCells.Style.Border.Right.Style = ExcelBorderStyle.Thin;

					row++;
				}

				// Auto fit columns
				worksheet.Cells.AutoFitColumns();
				package.Encryption.Password = excelPassword.ToString();


				var loggedEmployeeInfo = await _uoWForCurrentService.EmployeeRepository.RetrieveEmployeeInformation(loggedEmployee);
				await _emailAutomation.SendExportCostingPassword(excelPassword, loggedEmployeeInfo.CompanyEmail, loggedEmployeeInfo.FirstName);
				var fileBytes = package.GetAsByteArray();
				return new ExportFileResultDto()
				{
					FileContents = fileBytes,
					ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
					FileName = "Employee Costing.xlsx"
				};
			}
			catch (Exception e)
			{
				Console.WriteLine(e);
				throw;
			}

		}

		#endregion
	}
}
