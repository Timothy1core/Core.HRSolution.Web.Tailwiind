using APIAuthentication.Core.Dtos.Authentication;
using APIAuthentication.Core.Dtos.UserRole;
using HRApplicationDbLibrary.Core.Entities.Tables;

namespace APIAuthentication.Core.Repositories.HRSolution;

public interface IUserMenuAccessRepository
{
	Task<List<UserMenusDto>> UserMenus(string userEmployeeId);
	Task<List<string>> UserMenuPaths(string userEmployeeId);
	Task CreateUserMenuAccess(UserMenuAccess userMenu);
	Task UpdateUserMenuAccess(UserMenuAccess userMenu);
	Task RemoveUserMenuAccess(int menuId);
	Task DisableUserMenuAccess(int menuId, bool isHidden);
	Task<List<UserMenuDashboardDto>> RetrieveUserMenuAccessList();
	Task<UserMenuAccess> RetrieveUserMenuAccessInfo(int menuId);
}