using APIAuthentication.Core.Dtos.UserRole;
using HRApplicationDbLibrary.Core.Entities.Tables;
using HRApplicationDbLibrary.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace APIAuthentication.Persistence.Repositories.HRSolution
{
	public class UserApiPermissionRepository(HrSolutionApplicationDbContext context) : IUserApiPermissionRepository
	{
		public async Task CreateApiPermission(UserApiPermission userApiPermission)
		{
			await context.UserApiPermissions.AddAsync(userApiPermission);

		}

		public async Task<UserApiPermission> RetrieveApiPermissionInfo(int permissionId)
		{
			var apiPermission = await context.UserApiPermissions
				.FirstOrDefaultAsync(x => x.Id == permissionId && x.IsActive);

			return apiPermission!;
		}

		public async Task<List<UserApiPermissionDashboardDto>> RetrieveApiPermissionList()
		{
			var apiPermissionList = await context.UserApiPermissions
				.Where(x => x.IsActive)
				.Select(s => new UserApiPermissionDashboardDto()
				{
					Id = s.Id,
					Role = s.Role.Role,
					IsActive = s.IsActive,
					PermissionName = s.Api.ApiPermission
				})
				.ToListAsync();

			return apiPermissionList;
		}

		public async Task UpdateApiPermission(UserApiPermission userApiPermission)
		{
			var apiPermission = await context.UserApiPermissions.FirstOrDefaultAsync(x => x.Id == userApiPermission.Id);

			if (apiPermission != null)
			{
				apiPermission.RoleId = userApiPermission.RoleId;
				apiPermission.ApiId = userApiPermission.ApiId;
			}
		}

		public async Task RemovedApiPermission(int apiPermissionId)
		{
			var apiPermission = await context.UserApiPermissions.FirstOrDefaultAsync(x => x.Id == apiPermissionId);

			if (apiPermission != null) apiPermission.IsActive = false;
		}
	}
}
