using APIAuthentication.Core.Dtos.UserRole;
using APIAuthentication.Core.Repositories.HRSolution;
using HRApplicationDbLibrary.Core.Entities.Tables;
using HRApplicationDbLibrary.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace APIAuthentication.Persistence.Repositories.HRSolution
{
	public class UserRoleRepository(HrSolutionApplicationDbContext context) : IUserRoleRepository
	{
		public async Task CreateRole(UserRole userRole)
		{
			await context.UserRoles.AddAsync(userRole);

		}

		public async Task<UserRole> RetrieveRoleInfo(int roleId)
		{
			var role = await context.UserRoles.FirstOrDefaultAsync(x=> x.Id== roleId && x.IsActive);

			return role!;
		}

		public async Task<List<UserRoleDashboardDto>> RetrieveRoleList()
		{
			var roleList = await context.UserRoles
				.Where(x=> x.IsActive)
				.Select(s => new UserRoleDashboardDto()
				{
					Id = s.Id,
					Role = s.Role,
					IsActive = s.IsActive,
					CreatedDate = s.CreatedDate,
					CreatedBy = s.CreatedBy
				})
				.ToListAsync();

			return roleList;
		}

		public async Task UpdateRole(UserRole userRole)
		{
			var role = await context.UserRoles.FirstOrDefaultAsync(x => x.Id == userRole.Id);

			if (role != null) role.Role = userRole.Role;
		}

		public async Task RemovedRole(int roleId)
		{
			var role = await context.UserRoles.FirstOrDefaultAsync(x => x.Id == roleId);

			if (role != null) role.IsActive = false;
		}

	}
}
