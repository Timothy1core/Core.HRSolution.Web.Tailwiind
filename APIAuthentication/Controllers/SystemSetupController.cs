using APIAuthentication.Core.Application;
using Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using APIAuthentication.Core.Dtos.UserRole;
using HRApplicationDbLibrary.Core.Entities.Tables;



namespace APIAuthentication.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class SystemSetupController(
		ISystemSetupService systemSetupService

    ) : ControllerBase
	{

		private readonly ISystemSetupService _systemSetupService = systemSetupService;

        #region Role

		[Authorize]
		[Permission("system.setup.create.role")]
		[HttpPost("create_role")]
		public async Task<IActionResult> CreateRoleAccess([FromForm] string roleName)
		{
			var loggedEmployee = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

			var result =await _systemSetupService.CreateRoleService(roleName, loggedEmployee);

			return result;
		}

		[Authorize]
		[Permission("system.setup.update.role")]
		[HttpPut("update_role/{id}")]
		public async Task<IActionResult> UpdateRoleAccess(int id,[FromForm] string roleName)
		{
			var result = await _systemSetupService.UpdateRoleService(roleName, id);
			return result;
		}

		[Authorize]
		[Permission("system.setup.remove.role")]
		[HttpPut("remove_role/{id}")]
		public async Task<IActionResult> RemoveRoleAccess(int id)
		{

			var result = await _systemSetupService.RemoveRoleService(id);

			return result;

		}

		[Authorize]
		[Permission("system.setup.retrieve.role.list")]
		[HttpPost("list_role")]
		public async Task<IActionResult> RetrieveRoleList([FromForm] string? search)
		{

                var start = Convert.ToInt32(HttpContext.Request.Form["start"]);
                var length = Convert.ToInt32(HttpContext.Request.Form["length"]);
                string sortColumnName = HttpContext.Request.Form["sortColumnKey"]!;
                string sortDirection = HttpContext.Request.Form["sortDirection"]!;
                string draw = HttpContext.Request.Form["draw"]!;

            var result = await _systemSetupService.RetrieveAllRolesService(search, start, length, draw, sortColumnName, sortDirection);

                return result;
		}


		[Authorize]
		[Permission("system.setup.retrieve.role.info")]
		[HttpGet("info_role/{id}")]
		public async Task<IActionResult> RetrieveRoleAccess(int id)
		{

			var result = await _systemSetupService.RetrieveRoleService(id);

			return result;

		}

        #endregion

        #region ApiPermission
        [Authorize]
		[Permission("system.setup.create.permission")]
		[HttpPost("create_api_permission")]
		public async Task<IActionResult> CreateApiPermission([FromForm] UserApiPermissionRequestDto requestDto)
		{

			var result = await _systemSetupService.CreateApiPermissionService(requestDto);

			return result;
		}

		[Authorize]
		[Permission("system.setup.update.permission")]
		[HttpPut("update_api_permission/{id}")]
		public async Task<IActionResult> UpdateApiPermission(int id, [FromForm] int roleId, [FromForm] int apiId)
		{

			var result = await _systemSetupService.UpdateApiPermissionService(id, roleId, apiId);

			return result;

		}

		[Authorize]
		[Permission("system.setup.remove.permission")]
		[HttpPut("remove_api_permission/{id}")]
		public async Task<IActionResult> RemoveApiPermission(int id)
		{

			var result = await _systemSetupService.RemoveApiPermissionService(id);

			return result;

		}

		[Authorize]
		[Permission("system.setup.retrieve.permission.list")]
		[HttpPost("list_api_permission")]
		public async Task<IActionResult> RetrieveApiPermissionList([FromForm] string? search)
		{
            var start = Convert.ToInt32(HttpContext.Request.Form["start"]);
            var length = Convert.ToInt32(HttpContext.Request.Form["length"]);
            string sortColumnName = HttpContext.Request.Form["sortColumnKey"]!;
            string sortDirection = HttpContext.Request.Form["sortDirection"]!;
            string draw = HttpContext.Request.Form["draw"]!;

            var result = await _systemSetupService.RetrieveAllApiPermissionService(search, start, length, draw, sortColumnName, sortDirection);

            return result;

		}


		[Authorize]
		[Permission("system.setup.retrieve.permission.info")]
		[HttpGet("info_api_permission/{id}")]
		public async Task<IActionResult> RetrieveApiPermission(int id)
		{

			var result = await _systemSetupService.RetrieveApiPermissionService(id);

			return result;

		}
		#endregion


		#region UserMenu
		[Authorize]
		[Permission("system.setup.create.user.menu")]
		[HttpPost("create_user_menu")]
		public async Task<IActionResult> CreateUserMenu([FromForm] UserMenuRequestDto requestDto)
		{
			var loggedEmployee = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

			var result = await _systemSetupService.CreateUserMenuService(requestDto, loggedEmployee);

			return result;
		}

		[Authorize]
		[Permission("system.setup.update.user.menu")]
		[HttpPut("update_user_menu/{id}")]
		public async Task<IActionResult> UpdateUserMenu(int id, [FromForm] UserMenuRequestDto requestDto)
		{

			var result = await _systemSetupService.UpdateUserMenuService(id, requestDto);

			return result;

		}

		[Authorize]
		[Permission("system.setup.remove.user.menu")]
		[HttpPut("remove_user_menu/{id}")]
		public async Task<IActionResult> RemoveUserMenu(int id)
		{

			var result = await _systemSetupService.RemoveUserMenuService(id);

			return result;

		}

		[Authorize]
		[Permission("system.setup.hide.user.menu")]
		[HttpPut("hide_user_menu/{id}")]
		public async Task<IActionResult> HideUserMenu(int id, [FromForm] bool isHidden)
		{

			var result = await _systemSetupService.DisableUserMenuService(id, isHidden);

			return result;

		}

		[Authorize]
		[Permission("system.setup.retrieve.user.menu.list")]
		[HttpPost("list_user_menu")]
		public async Task<IActionResult> RetrieveUserMenuList([FromForm] string? search)
		{

            var start = Convert.ToInt32(HttpContext.Request.Form["start"]);
            var length = Convert.ToInt32(HttpContext.Request.Form["length"]);
            string sortColumnName = HttpContext.Request.Form["sortColumnKey"]!;
            string sortDirection = HttpContext.Request.Form["sortDirection"]!;
            string draw = HttpContext.Request.Form["draw"]!;

            var result = await _systemSetupService.RetrieveAllUserMenuService(search, start, length, draw, sortColumnName, sortDirection);

			return result;

		}


		[Authorize]
		[Permission("system.setup.retrieve.user.menu.info")]
		[HttpGet("info_api_menu/{id}")]
		public async Task<IActionResult> RetrieveUserMenu(int id)
		{

			var result = await _systemSetupService.RetrieveUserMenuService(id);

			return result;

		}
        #endregion

        #region Api
        [Authorize]
        [Permission("system.setup.create.api")]
        [HttpPost("create_api")]
        public async Task<IActionResult> CreateApi([FromForm] string apiPermission)
        {
            var loggedEmployee = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            var result = await _systemSetupService.CreateApiService(apiPermission, loggedEmployee);

            return result;
        }

        [Authorize]
        [Permission("system.setup.update.api")]
        [HttpPut("update_api/{id}")]
        public async Task<IActionResult> UpdateApi(int id, [FromForm] string apiPermission)
        {
            var result = await _systemSetupService.UpdateApiService(apiPermission, id);
            return result;
        }

        [Authorize]
        [Permission("system.setup.retrieve.api.list")]
        [HttpPost("list_api")]
        public async Task<IActionResult> RetrieveApiList([FromForm] string? search)
        {
            var start = Convert.ToInt32(HttpContext.Request.Form["start"]);
            var length = Convert.ToInt32(HttpContext.Request.Form["length"]);
            string sortColumnName = HttpContext.Request.Form["sortColumnKey"]!;
            string sortDirection = HttpContext.Request.Form["sortDirection"]!;
            string draw = HttpContext.Request.Form["draw"]!;


            var result = await _systemSetupService.RetrieveAllApisService(search, start, length, draw, sortColumnName, sortDirection);

            return result;

        }

        [Authorize]
        [Permission("system.setup.retrieve.api.info")]
        [HttpGet("info_api/{id}")]
        public async Task<IActionResult> RetrieveApi(int id)
        {

            var result = await _systemSetupService.RetrieveApiService(id);

            return result;

        }

        [Authorize]
        [Permission("system.setup.remove.api")]
        [HttpPut("remove_api/{id}")]
        public async Task<IActionResult> RemoveApi(int id)
        {

            var result = await _systemSetupService.RemoveApiService(id);

            return result;

        }

        #endregion


        #region Section Menu
        [Authorize]
        [Permission("system.setup.create.section.menu")]
        [HttpPost("create_section_menu")]
        public async Task<IActionResult> CreateSectionMenu([FromForm] SectionMenu sectionMenuDto)
        {
            var loggedEmployee = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            var result = await _systemSetupService.CreateSectionMenuService(sectionMenuDto, loggedEmployee);

            return result;
        }

        [Authorize]
        [Permission("system.setup.update.section.menu")]
        [HttpPut("update_section_menu/{id}")]
        public async Task<IActionResult> UpdateSectionMenu(int id, [FromForm] string sectionName, [FromForm] int orderBy)
        {
            var result = await _systemSetupService.UpdateSectionMenuService(sectionName, orderBy, id);
            return result;
        }

        [Authorize]
        [Permission("system.setup.retrieve.section.menu.list")]
        [HttpPost("list_section_menu")]
        public async Task<IActionResult> RetrieveSectionMenuList([FromForm] string? search)
        {
            var start = Convert.ToInt32(HttpContext.Request.Form["start"]);
            var length = Convert.ToInt32(HttpContext.Request.Form["length"]);
            string sortColumnName = HttpContext.Request.Form["sortColumnKey"]!;
            string sortDirection = HttpContext.Request.Form["sortDirection"]!;
            string draw = HttpContext.Request.Form["draw"]!;

            var result = await _systemSetupService.RetrieveAllSectionMenusService(search, start, length, draw, sortColumnName, sortDirection);

            return result;

        }

        [Authorize]
        [Permission("system.setup.retrieve.section.menu.info")]
        [HttpGet("info_section_menu/{id}")]
        public async Task<IActionResult> RetrieveSectionMenu(int id)
        {

            var result = await _systemSetupService.RetrieveSectionMenuService(id);

            return result;

        }

        [Authorize]
        [Permission("system.setup.remove.section.menu")]
        [HttpPut("remove_section_menu/{id}")]
        public async Task<IActionResult> RemoveSectionMenu(int id)
        {

            var result = await _systemSetupService.RemoveSectionMenuService(id);

            return result;

        }

        #endregion
    }
}
