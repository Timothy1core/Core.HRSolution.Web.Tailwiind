using static System.Runtime.InteropServices.JavaScript.JSType;

namespace HRIS.Service.API.Core.Models.CurrentService.Dto.Employee
{
	public class CostingDashboardDto
	{
		public string EmployeeId { get; set; }
		public string YearId { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public string MiddleNamePrefix { get; set; }
		public string DepartmentGroupName { get; set; }
		public string DepartmentName { get; set; }
		public string BasicPay { get; set; }
		public string MealAllowance { get; set; }
		public string RiceAllowance { get; set; }
		public string ClothingAllowance { get; set; }
		public string LaundryAllowance { get; set; }
		public string MedicalCashAllowance { get; set; }
		public string TaxableAllowance { get; set; }
		public string Deminimis { get; set; }
		public decimal TotalSalary => Convert.ToDecimal(BasicPay) + Convert.ToDecimal(Deminimis);
		public string EmployeeFullName => LastName + ", " + FirstName + " " + MiddleNamePrefix;
	}
}
