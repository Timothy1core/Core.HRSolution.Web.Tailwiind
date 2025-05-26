using HRIS.Service.API.Core.Repositories.CurrentService.Tables;

namespace HRIS.Service.API.Persistence.UnitOfWork
{
	public interface IUoWForCurrentService
	{
		IEmployeeRepository EmployeeRepository { get; }
		IEmployeeDependentRepository EmployeeDependentRepository { get; }
		IEmployeeDocumentRepository EmployeeDocumentRepository { get; }
		void SaveChanges();
		Task CommitAsync();
	}
}
