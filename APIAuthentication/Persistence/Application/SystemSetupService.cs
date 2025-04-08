using APIAuthentication.Core.Application;
using APIAuthentication.Core.Dtos.UserRole;
using APIAuthentication.Core.UnitOfWork;
using HRApplicationDbLibrary.Core.Entities.Tables;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Linq.Dynamic.Core;

namespace APIAuthentication.Persistence.Application
{
	public class SystemSetupService(
		IUoWForHrSolutionApplication uoWForHrSolutionApplication,
		ILogger<UserCredentialService> logger
		) : ISystemSetupService
	{

		private readonly IUoWForHrSolutionApplication _uoWForHrSolutionApplication = uoWForHrSolutionApplication;
		private readonly ILogger<UserCredentialService> _logger = logger;

		#region Role
		public async Task<JsonResult> CreateRoleService(string roleName, string createdBy)
		{
			JsonResult result;
			try
			{
				var role = new UserRole
				{
					Role = roleName,
					CreatedBy = createdBy,
					CreatedDate = DateTime.UtcNow.AddHours(8),
					IsActive = true
				};
				await _uoWForHrSolutionApplication.UserRoleRepository.CreateRole(role);
				await _uoWForHrSolutionApplication.CommitAsync();

				result = new JsonResult(new { success = true, responseText = "User Role Successfully Saved " })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while creating user role: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while creating user role: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}
		public async Task<IActionResult> RetrieveAllRolesService(string? search, int start, int length, string draw, string sortColumnName, string sortDirection)
		{
			JsonResult result;
			try
			{

                var roles = await _uoWForHrSolutionApplication.UserRoleRepository.RetrieveRoleList();

                var totalRows = roles.Count();

                roles = !string.IsNullOrEmpty(search) ? roles.Where(x =>
                    x.CreatedBy.ToLower().Contains(search.ToLower()) ||
                    x.Role.ToLower().Contains(search.ToLower())).ToList() : roles.ToList();

                var totalRowsAfterFiltering = roles.Count();

				roles = roles.AsQueryable().OrderBy(sortColumnName + " " + sortDirection).ToList();
                roles = length != -1 ? roles.Skip(start).Take(length).ToList() : roles.ToList();

                result = new JsonResult(new { data = roles, draw, recordsTotal = totalRows, recordsFiltered = totalRowsAfterFiltering })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving user roles: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while retrieving user roles: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}
		public async Task<JsonResult> RetrieveRoleService(int roleId)
		{
			JsonResult result;
			try
			{

				var role = await _uoWForHrSolutionApplication.UserRoleRepository.RetrieveRoleInfo(roleId);

				result = new JsonResult(new { role })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving user role: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while retrieving user role: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}
		public async Task<JsonResult> UpdateRoleService(string roleName, int roleId)
		{
			JsonResult result;
			try
			{
				var role = new UserRole
				{
					Id = roleId,
					Role = roleName,
				};
				await _uoWForHrSolutionApplication.UserRoleRepository.UpdateRole(role);
				await _uoWForHrSolutionApplication.CommitAsync();

				result = new JsonResult(new { success = true, responseText = "User Role Successfully Saved " })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while updating user role: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while updating user role: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}
		public async Task<JsonResult> RemoveRoleService(int roleId)
		{
			JsonResult result;
			try
			{

				await _uoWForHrSolutionApplication.UserRoleRepository.RemovedRole(roleId);
				await _uoWForHrSolutionApplication.CommitAsync();

				result = new JsonResult(new { success = true, responseText = "User Role Successfully Saved " })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while removing user role: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while removing user role: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}
		#endregion

		#region Permission
		public async Task<JsonResult> CreateApiPermissionService(UserApiPermissionRequestDto userApiPermissionRequest)
		{
			JsonResult result;
			try
			{
				var userApiPermission = new UserApiPermission()
				{
					RoleId = userApiPermissionRequest.RoleId,
					ApiId = userApiPermissionRequest.ApiId,
					IsActive = true
				};
				await _uoWForHrSolutionApplication.UserApiPermissionRepository.CreateApiPermission(userApiPermission);
				await _uoWForHrSolutionApplication.CommitAsync();

				result = new JsonResult(new { success = true, responseText = "User Permission Successfully Saved " })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while creating user permission: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while creating user permission: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}
		public async Task<JsonResult> RetrieveAllApiPermissionService(string? search, int start, int length, string draw, string sortColumnName, string sortDirection)
        {
			JsonResult result;
			try
			{
				var permissions = await _uoWForHrSolutionApplication.UserApiPermissionRepository.RetrieveApiPermissionList();

                var totalRows = permissions.Count();

                permissions = !string.IsNullOrEmpty(search) ? permissions.Where(x =>
                    x.PermissionName.ToLower().Contains(search.ToLower()) ||
                    x.Role.ToLower().Contains(search.ToLower())).ToList() : permissions.ToList();

                var totalRowsAfterFiltering = permissions.Count();

                permissions = permissions.AsQueryable().OrderBy(sortColumnName + " " + sortDirection).ToList();
                permissions = length != -1 ? permissions.Skip(start).Take(length).ToList() : permissions.ToList();

                result = new JsonResult(new { data = permissions, draw, recordsTotal = totalRows, recordsFiltered = totalRowsAfterFiltering })
                {
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving user permissions: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while retrieving user permissions: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}
		public async Task<JsonResult> RetrieveApiPermissionService(int permissionId)
		{
			JsonResult result;
			try
			{

				var permission = await _uoWForHrSolutionApplication.UserApiPermissionRepository.RetrieveApiPermissionInfo(permissionId);

				result = new JsonResult(new { permission })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving user permission: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while retrieving user permission: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}
		public async Task<JsonResult> UpdateApiPermissionService(int permissionId, int roleId, int apiId)
		{
			JsonResult result;
			try
			{
				var permission = new UserApiPermission()
				{
					Id = permissionId,
					RoleId = roleId,
					ApiId = apiId
				};
				await _uoWForHrSolutionApplication.UserApiPermissionRepository.UpdateApiPermission(permission);
				await _uoWForHrSolutionApplication.CommitAsync();

				result = new JsonResult(new { success = true, responseText = "User Permission Successfully Saved " })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while updating user permission: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while updating user permission: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}
		public async Task<JsonResult> RemoveApiPermissionService(int permissionId)
		{
			JsonResult result;
			try
			{

				await _uoWForHrSolutionApplication.UserApiPermissionRepository.RemovedApiPermission(permissionId);
				await _uoWForHrSolutionApplication.CommitAsync();

				result = new JsonResult(new { success = true, responseText = "User Role Successfully Saved " })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while removing user permission: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while removing user permission: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}
		#endregion

		#region UserMenus
		public async Task<JsonResult> CreateUserMenuService(UserMenuRequestDto userMenuRequestDto,string createdBy)
		{
			JsonResult result;
			try
			{
				var menu = new UserMenuAccess()
				{
					RoleId = userMenuRequestDto.RoleId,
					MenuName = userMenuRequestDto.MenuName,
					MenuPath = userMenuRequestDto.MenuPath,
					MenuIcon = userMenuRequestDto.MenuIcon,
					IsParent = userMenuRequestDto.IsParent,
					IsSubParent = userMenuRequestDto.IsSubParent,
					SectionMenuId = userMenuRequestDto.SectionMenuId,
					ParentId = userMenuRequestDto.ParentId,
					OrderBy = userMenuRequestDto.OrderBy,
					IsActive = true,
					IsHidden = false,
					CreatedBy = createdBy,
					CreatedDate = DateTime.UtcNow.AddHours(8)
				};
				await _uoWForHrSolutionApplication.UserMenuAccessRepository.CreateUserMenuAccess(menu);
				await _uoWForHrSolutionApplication.CommitAsync();

				result = new JsonResult(new { success = true, responseText = "Menu Successfully Saved " })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while creating menu: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while creating menu: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}
		public async Task<JsonResult> RetrieveAllUserMenuService(string? search, int start, int length, string draw, string sortColumnName, string sortDirection)
        {
			JsonResult result;
			try
			{
				var menus = await _uoWForHrSolutionApplication.UserMenuAccessRepository.RetrieveUserMenuAccessList();

                var totalRows = menus.Count();
                menus = !string.IsNullOrEmpty(search) ? menus.Where(x =>
                    x.MenuName.ToLower().Contains(search.ToLower()) ||
                    x.SectionMenu.ToLower().Contains(search.ToLower()) ||
                    x.Role.ToLower().Contains(search.ToLower()) ||
                    x.MenuPath.ToLower().Contains(search.ToLower())).ToList() : menus.ToList();

                var totalRowsAfterFiltering = menus.Count();

                menus = menus.AsQueryable().OrderBy(sortColumnName + " " + sortDirection).ToList();
                menus = length != -1 ? menus.Skip(start).Take(length).ToList() : menus.ToList();
                result = new JsonResult(new { data = menus, draw, recordsTotal = totalRows, recordsFiltered = totalRowsAfterFiltering })
                {
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving menu: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while retrieving menu: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}
		public async Task<JsonResult> RetrieveUserMenuService(int menuId)
		{
			JsonResult result;
			try
			{

				var menu = await _uoWForHrSolutionApplication.UserMenuAccessRepository.RetrieveUserMenuAccessInfo(menuId);

				result = new JsonResult(new { menu })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while retrieving menu: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while retrieving menu: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}
		public async Task<JsonResult> UpdateUserMenuService(int menuId, UserMenuRequestDto userMenu)
		{
			JsonResult result;
			try
			{
				var menu = new UserMenuAccess()
				{
					Id = menuId,
					RoleId = userMenu.RoleId,
					MenuName = userMenu.MenuName,
					MenuPath = userMenu.MenuPath,
					MenuIcon = userMenu.MenuIcon,
					IsParent = userMenu.IsParent,
					IsSubParent = userMenu.IsSubParent,
					SectionMenuId = userMenu.SectionMenuId,
					ParentId = userMenu.ParentId,
					OrderBy = userMenu.OrderBy,
				};
				await _uoWForHrSolutionApplication.UserMenuAccessRepository.UpdateUserMenuAccess(menu);
				await _uoWForHrSolutionApplication.CommitAsync();

				result = new JsonResult(new { success = true, responseText = "Menu Successfully Saved " })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while updating menu: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while updating menu: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}
		public async Task<JsonResult> RemoveUserMenuService(int menuId)
		{
			JsonResult result;
			try
			{

				await _uoWForHrSolutionApplication.UserMenuAccessRepository.RemoveUserMenuAccess(menuId);
				await _uoWForHrSolutionApplication.CommitAsync();

				result = new JsonResult(new { success = true, responseText = "Menu Successfully Removed" })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while removing menu: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while removing menu: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}

		public async Task<JsonResult> DisableUserMenuService(int menuId, bool isHidden)
		{
			JsonResult result;
			try
			{

				await _uoWForHrSolutionApplication.UserMenuAccessRepository.DisableUserMenuAccess(menuId, isHidden);
				await _uoWForHrSolutionApplication.CommitAsync();

				result = new JsonResult(new { success = true, responseText = "Menu Successfully Hidden" })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while hiding menu: {e.Message}");

				result = new JsonResult(new { success = false, responseText = $"Error occurred while hiding menu: {e.Message}" })
				{
					StatusCode = 400
				};
				return result;

			}
		}
		#endregion

		#region Api
		public async Task<JsonResult> CreateApiService(string apiPermission, string createdBy)
        {
            JsonResult result;
            try
            {
                var api = new Api()
                {
                    ApiPermission = apiPermission,
                    CreatedBy = createdBy,
                    CreatedDate = DateTime.UtcNow.AddHours(8),
                    IsActive = true
                };
                await _uoWForHrSolutionApplication.ApiRepository.CreateApi(api);
                await _uoWForHrSolutionApplication.CommitAsync();

                result = new JsonResult(new { success = true, responseText = "Api Successfully Saved " })
                {
                    StatusCode = 200
                };
                return result;

            }
            catch (Exception e)
            {
                _logger.LogError($"Error occurred while creating api: {e.Message}");

                result = new JsonResult(new { success = false, responseText = $"Error occurred while creating api: {e.Message}" })
                {
                    StatusCode = 400
                };
                return result;

            }
        }

        public async Task<JsonResult> RetrieveAllApisService(string? search, int start, int length, string draw, string sortColumnName, string sortDirection)
        {
            JsonResult result;
            try
            {
                var permissions = await _uoWForHrSolutionApplication.ApiRepository.RetrieveApiList();
                var totalRows = permissions.Count();

                permissions = !string.IsNullOrEmpty(search) ? permissions.Where(x =>
                    x.ApiPermission.ToLower().Contains(search.ToLower())).ToList() : permissions.ToList();

                var totalRowsAfterFiltering = permissions.Count();

                permissions = permissions.AsQueryable().OrderBy(sortColumnName + " " + sortDirection).ToList();
                permissions = length != -1 ? permissions.Skip(start).Take(length).ToList() : permissions.ToList();

                result = new JsonResult(new { data = permissions, draw, recordsTotal = totalRows, recordsFiltered = totalRowsAfterFiltering })
                {
                    StatusCode = 200
                };
                return result;

            }
            catch (Exception e)
            {
                _logger.LogError($"Error occurred while retrieving apis: {e.Message}");

                result = new JsonResult(new { success = false, responseText = $"Error occurred while retrieving apis: {e.Message}" })
                {
                    StatusCode = 400
                };
                return result;

            }
        }
        public async Task<JsonResult> RetrieveApiService(int apiId)
        {
            JsonResult result;
            try
            {

                var api = await _uoWForHrSolutionApplication.ApiRepository.RetrieveApiInfo(apiId);

                result = new JsonResult(new { api })
                {
                    StatusCode = 200
                };
                return result;

            }
            catch (Exception e)
            {
                _logger.LogError($"Error occurred while retrieving api: {e.Message}");

                result = new JsonResult(new { success = false, responseText = $"Error occurred while retrieving api: {e.Message}" })
                {
                    StatusCode = 400
                };
                return result;

            }
        }
        public async Task<JsonResult> UpdateApiService(string apiPermission, int apiId)
        {
            JsonResult result;
            try
            {
                var api = new Api()
                {
                    Id = apiId,
                    ApiPermission = apiPermission,
                };
                await _uoWForHrSolutionApplication.ApiRepository.UpdateApi(api);
                await _uoWForHrSolutionApplication.CommitAsync();

                result = new JsonResult(new { success = true, responseText = "Api Successfully Updated " })
                {
                    StatusCode = 200
                };
                return result;

            }
            catch (Exception e)
            {
                _logger.LogError($"Error occurred while updating api: {e.Message}");

                result = new JsonResult(new { success = false, responseText = $"Error occurred while updating api: {e.Message}" })
                {
                    StatusCode = 400
                };
                return result;

            }
        }
        public async Task<JsonResult> RemoveApiService(int apiId)
        {
            JsonResult result;
            try
            {

                await _uoWForHrSolutionApplication.ApiRepository.RemovedApi(apiId);
                await _uoWForHrSolutionApplication.CommitAsync();

                result = new JsonResult(new { success = true, responseText = "Api Successfully Removed" })
                {
                    StatusCode = 200
                };
                return result;

            }
            catch (Exception e)
            {
                _logger.LogError($"Error occurred while removing api: {e.Message}");

                result = new JsonResult(new { success = false, responseText = $"Error occurred while removing api: {e.Message}" })
                {
                    StatusCode = 400
                };
                return result;

            }
        }
        #endregion

        #region Section Menu
        public async Task<JsonResult> CreateSectionMenuService(SectionMenu sectionMenu, string createdBy)
        {
            JsonResult result;
            try
            {
                var sectionMenuData = new SectionMenu()
                {
					
                    SectionName = sectionMenu.SectionName,
                    OrderBy = sectionMenu.OrderBy,
                    CreatedBy = createdBy,
                    CreatedDate = DateTime.UtcNow.AddHours(8),
                    IsActive = true
                };
                await _uoWForHrSolutionApplication.SectionMenuRepository.CreateSectionMenu(sectionMenuData);
                await _uoWForHrSolutionApplication.CommitAsync();

                result = new JsonResult(new { success = true, responseText = "Section Menu Successfully Saved " })
                {
                    StatusCode = 200
                };
                return result;

            }
            catch (Exception e)
            {
                _logger.LogError($"Error occurred while creating section menu: {e.Message}");

                result = new JsonResult(new { success = false, responseText = $"Error occurred while creating section menu: {e.Message}" })
                {
                    StatusCode = 400
                };
                return result;

            }
        }

        public async Task<JsonResult> RetrieveAllSectionMenusService(string? search, int start, int length, string draw, string sortColumnName, string sortDirection)
        {
            JsonResult result;
            try
            {
                var sectionMenus = await _uoWForHrSolutionApplication.SectionMenuRepository.RetrieveSectionMenuList();

                var totalRows = sectionMenus.Count();

                sectionMenus = !string.IsNullOrEmpty(search) ? sectionMenus.Where(x =>
                    x.CreatedBy.ToLower().Contains(search.ToLower()) ||
                    x.SectionName.ToLower().Contains(search.ToLower())).ToList() : sectionMenus.ToList();

                var totalRowsAfterFiltering = sectionMenus.Count();

                sectionMenus = sectionMenus.AsQueryable().OrderBy(sortColumnName + " " + sortDirection).ToList();
                sectionMenus = length != -1 ? sectionMenus.Skip(start).Take(length).ToList() : sectionMenus.ToList();

                result = new JsonResult(new { data = sectionMenus, draw, recordsTotal = totalRows, recordsFiltered = totalRowsAfterFiltering })
                {
                    StatusCode = 200
                };
                return result;

            }
            catch (Exception e)
            {
                _logger.LogError($"Error occurred while retrieving section menus: {e.Message}");

                result = new JsonResult(new { success = false, responseText = $"Error occurred while retrieving section menus: {e.Message}" })
                {
                    StatusCode = 400
                };
                return result;

            }
        }
        public async Task<JsonResult> RetrieveSectionMenuService(int sectionMenuId)
        {
            JsonResult result;
            try
            {

                var sectionMenus = await _uoWForHrSolutionApplication.SectionMenuRepository.RetrieveSectionMenuInfo(sectionMenuId);

                result = new JsonResult(new { sectionMenus })
                {
                    StatusCode = 200
                };
                return result;

            }
            catch (Exception e)
            {
                _logger.LogError($"Error occurred while retrieving section menu: {e.Message}");

                result = new JsonResult(new { success = false, responseText = $"Error occurred while retrieving section menu: {e.Message}" })
                {
                    StatusCode = 400
                };
                return result;

            }
        }
        public async Task<JsonResult> UpdateSectionMenuService(string sectionName, int orderBy, int sectionMenuId)
        {
            JsonResult result;
            try
            {
                var sectionMenuData = new SectionMenu()
                {
                    Id = sectionMenuId,
                    SectionName = sectionName,
					OrderBy = orderBy
                };
                await _uoWForHrSolutionApplication.SectionMenuRepository.UpdateSectionMenu(sectionMenuData);
                await _uoWForHrSolutionApplication.CommitAsync();

                result = new JsonResult(new { success = true, responseText = "Section Menu Successfully Updated" })
                {
                    StatusCode = 200
                };
                return result;

            }
            catch (Exception e)
            {
                _logger.LogError($"Error occurred while updating section menu: {e.Message}");

                result = new JsonResult(new { success = false, responseText = $"Error occurred while updating section menu: {e.Message}" })
                {
                    StatusCode = 400
                };
                return result;

            }
        }
        public async Task<JsonResult> RemoveSectionMenuService(int sectionMenuId)
        {
            JsonResult result;
            try
            {

                await _uoWForHrSolutionApplication.SectionMenuRepository.RemovedSectionMenu(sectionMenuId);
                await _uoWForHrSolutionApplication.CommitAsync();

                result = new JsonResult(new { success = true, responseText = "Section Menu Successfully Removed" })
                {
                    StatusCode = 200
                };
                return result;

            }
            catch (Exception e)
            {
                _logger.LogError($"Error occurred while removing section menu: {e.Message}");

                result = new JsonResult(new { success = false, responseText = $"Error occurred while removing section menu: {e.Message}" })
                {
                    StatusCode = 400
                };
                return result;

            }
        }
        #endregion
    }
}
