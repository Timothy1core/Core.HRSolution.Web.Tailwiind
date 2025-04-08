using APIAuthentication.Core.Dtos.UserRole;
using HRApplicationDbLibrary.Core.Entities.Tables;

namespace APIAuthentication.Persistence.Repositories.HRSolution;

public interface IUserApiPermissionRepository
{
	Task CreateApiPermission(UserApiPermission userApiPermission);
	Task<UserApiPermission> RetrieveApiPermissionInfo(int permissionId);
	Task<List<UserApiPermissionDashboardDto>> RetrieveApiPermissionList();
	Task UpdateApiPermission(UserApiPermission userApiPermission);
	Task RemovedApiPermission(int apiPermissionId);
}