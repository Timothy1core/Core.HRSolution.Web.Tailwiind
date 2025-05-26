using HRIS.Service.API.Core.Repositories.CurrentService.Tables;
using HRIS.Service.API.Persistence.Repositories.CurrentService.Tables;
using HRSolutionDbLibrary.Persistence.DbContexts;

namespace HRIS.Service.API.Persistence.UnitOfWork
{
	public class UoWForCurrentService(CurrentServiceDbContext context) : IUoWForCurrentService
	{
		public IEmployeeRepository EmployeeRepository { get; } = new EmployeeRepository(context);
		public IEmployeeDependentRepository EmployeeDependentRepository { get; } = new EmployeeDependentRepository(context);
		public IEmployeeDocumentRepository EmployeeDocumentRepository { get; } = new EmployeeDocumentRepository(context);
		public void SaveChanges()
		{
			context.SaveChanges();
		}
		public async Task CommitAsync()
		{
			await context.SaveChangesAsync();
		}
	}
}
