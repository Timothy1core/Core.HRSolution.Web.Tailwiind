using APIAuthentication.Core.Dtos.UserRole;
using HRApplicationDbLibrary.Core.Entities.Tables;
using Microsoft.AspNetCore.Mvc;
using System.Drawing;

namespace APIAuthentication.Core.Application;

public interface ISystemSetupService
{
    #region Role

    Task<JsonResult> CreateRoleService(string roleName, string createdBy);
    Task<IActionResult> RetrieveAllRolesService(string? search, int start, int length, string draw, string sortColumnName, string sortDirection);
    Task<JsonResult> RetrieveRoleService(int roleId);
    Task<JsonResult> UpdateRoleService(string roleName, int roleId);
    Task<JsonResult> RemoveRoleService(int roleId);

    #endregion

    #region Permission

    Task<JsonResult> CreateApiPermissionService(UserApiPermissionRequestDto userApiPermissionRequest);
    Task<JsonResult> RetrieveAllApiPermissionService(string? search, int start, int length, string draw, string sortColumnName, string sortDirection);
    Task<JsonResult> RetrieveApiPermissionService(int permissionId);
    Task<JsonResult> UpdateApiPermissionService(int permissionId, int roleId, int apiId);
    Task<JsonResult> RemoveApiPermissionService(int permissionId);

    #endregion

    #region UserMenus

    Task<JsonResult> CreateUserMenuService(UserMenuRequestDto userMenuRequestDto, string createdBy);
    Task<JsonResult> RetrieveAllUserMenuService(string? search, int start, int length, string draw, string sortColumnName, string sortDirection);
    Task<JsonResult> RetrieveUserMenuService(int menuId);
    Task<JsonResult> UpdateUserMenuService(int menuId, UserMenuRequestDto userMenu);
    Task<JsonResult> RemoveUserMenuService(int menuId);
    Task<JsonResult> DisableUserMenuService(int menuId, bool isHidden);

	#endregion

	#region Api

	Task<JsonResult> CreateApiService(string apiPermission, string createdBy);

    Task<JsonResult> RetrieveAllApisService(string? search, int start, int length, string draw, string sortColumnName,
        string sortDirection);
    Task<JsonResult> RetrieveApiService(int apiId);
    Task<JsonResult> UpdateApiService(string apiPermission, int apiId);
    Task<JsonResult> RemoveApiService(int apiId);

    #endregion

    #region Section Menu

    public Task<JsonResult> CreateSectionMenuService(SectionMenu sectionMenu, string createdBy);


    public Task<JsonResult> RetrieveAllSectionMenusService(string? search, int start, int length, string draw, string sortColumnName, string sortDirection);

    public Task<JsonResult> RetrieveSectionMenuService(int sectionMenuId);

    public Task<JsonResult> UpdateSectionMenuService(string sectionName, int orderBy, int sectionMenuId);

    public Task<JsonResult> RemoveSectionMenuService(int sectionMenuId);

    #endregion

    
}