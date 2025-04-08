using APIAuthentication.Core.Repositories.HRSolution;
using APIAuthentication.Core.UnitOfWork;
using APIAuthentication.Persistence.Repositories.HRSolution;
using HRApplicationDbLibrary.Persistence.DbContexts;

namespace APIAuthentication.Persistence.UnitOfWork
{
	public class UoWForHrSolutionApplication (HrSolutionApplicationDbContext context): IUoWForHrSolutionApplication
	{
		private readonly HrSolutionApplicationDbContext _context = context;

		public IUserCredentialRepository UserCredentialRepository { get; } = new UserCredentialRepository(context);
		public IUserDetailRepository UserDetailRepository { get; } = new UserDetailRepository(context);
		public IUserMenuAccessRepository UserMenuAccessRepository { get; } = new UserMenuAccessRepository(context);
		public IUserRoleRepository UserRoleRepository { get; } = new UserRoleRepository(context);
		public IUserApiPermissionRepository UserApiPermissionRepository { get; } = new UserApiPermissionRepository(context);
        public IApiRepository ApiRepository { get; } = new ApiRepository(context);
        public ISectionMenuRepository SectionMenuRepository { get; } = new SectionMenuRepository(context);
        public void SaveChanges()
		{
			_context.SaveChanges();
		}
		public async Task CommitAsync()
		{
			await _context.SaveChangesAsync();
		}
	}
}
