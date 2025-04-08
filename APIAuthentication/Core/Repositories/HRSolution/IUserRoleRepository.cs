using APIAuthentication.Core.Dtos.UserRole;
using HRApplicationDbLibrary.Core.Entities.Tables;

namespace APIAuthentication.Core.Repositories.HRSolution;

public interface IUserRoleRepository
{
	Task CreateRole(UserRole userRole);
	Task<UserRole> RetrieveRoleInfo(int roleId);
	Task<List<UserRoleDashboardDto>> RetrieveRoleList();
	Task UpdateRole(UserRole userRole);
	Task RemovedRole(int roleId);
}