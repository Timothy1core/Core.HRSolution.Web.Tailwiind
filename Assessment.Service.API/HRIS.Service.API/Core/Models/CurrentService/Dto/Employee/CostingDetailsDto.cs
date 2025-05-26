namespace HRIS.Service.API.Core.Models.CurrentService.Dto.Employee
{
	public class CostingDetailsDto
	{
		public string EmployeeId { get; set; }
		public string BasicPay { get; set; }

		public string MealAllowance { get; set; }

		public string RiceAllowance { get; set; }

		public string ClothingAllowance { get; set; }

		public string LaundryAllowance { get; set; }

		public string MedicalCashAllowance { get; set; }

		public string TaxableAllowance { get; set; }

		public string Deminimis { get; set; }
	}
}
