using APIAuthentication.Core.Repositories.HRSolution;
using APIAuthentication.Persistence.Repositories.HRSolution;

namespace APIAuthentication.Core.UnitOfWork;

public interface IUoWForHrSolutionApplication
{
	IUserCredentialRepository UserCredentialRepository { get; }
	IUserDetailRepository UserDetailRepository { get; }
	IUserMenuAccessRepository UserMenuAccessRepository { get; }
	IUserRoleRepository UserRoleRepository { get; }
	IUserApiPermissionRepository UserApiPermissionRepository { get; }
	IApiRepository ApiRepository { get; }

    ISectionMenuRepository SectionMenuRepository { get; }
    
    void SaveChanges();
	Task CommitAsync();
}