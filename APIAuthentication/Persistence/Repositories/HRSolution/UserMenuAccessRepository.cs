using APIAuthentication.Core.Dtos.Authentication;
using APIAuthentication.Core.Dtos.UserRole;
using APIAuthentication.Core.Repositories.HRSolution;
using HRApplicationDbLibrary.Core.Entities.Tables;
using HRApplicationDbLibrary.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace APIAuthentication.Persistence.Repositories.HRSolution
{
	public class UserMenuAccessRepository(HrSolutionApplicationDbContext context) : IUserMenuAccessRepository
	{
		public async Task<List<UserMenusDto>> UserMenus(string userEmployeeId)
		{
			var userMenu = await context.SectionMenus
				.Where(x=> x.IsActive && x.UserMenuAccesses.Count(c=> c.IsActive && c.Role.UserCredentials.Count(cc=> cc.EmployeeId == userEmployeeId)>0) >0)
				.Include(x => x.UserMenuAccesses)
				.AsNoTracking()
				.OrderBy(o=> o.OrderBy)
				.ToListAsync();


			var userMenusDtos = userMenu.Select(s=> new UserMenusDto()
				{
					SectionName = s.SectionName,
					Menus = s.UserMenuAccesses
						.Where(x=> x.IsParent && x.IsActive && !x.IsHidden! )
						.Select(mp => new MenuDto()
						{
							MenuId = mp.Id,
							MenuName = mp.MenuName,
							MenuPath = mp.MenuPath,
							Icon = mp.MenuIcon,
							IsParent = mp.IsParent,
							IsSubParent = mp.IsSubParent,
							SubMenus = s.UserMenuAccesses
								.Where(w=> w.ParentId == mp.Id && w.IsActive && !w.IsHidden)
								.Select(ms=> new MenuDto()
								{
									MenuId = ms.Id,
									MenuName = ms.MenuName,
									MenuPath = ms.MenuPath,
									Icon = ms.MenuIcon,
									IsParent = ms.IsParent,
									IsSubParent = ms.IsSubParent,
									SubMenus = s.UserMenuAccesses
										.Where(ww => ww.ParentId == ms.Id && ww.IsActive)
										.Select(msc => new MenuDto()
										{
											MenuId = msc.Id,
											MenuName = msc.MenuName,
											MenuPath = msc.MenuPath,
											Icon = msc.MenuIcon,
											IsParent = msc.IsParent,
											IsSubParent = msc.IsSubParent
										})
										.ToList()
								}).ToList()
						})
						.ToList()
				})
				.ToList();

			return userMenusDtos;
		}

		public async Task<List<string>> UserMenuPaths(string userEmployeeId)
		{
			var userMenuPaths = await context.UserMenuAccesses
				.Include(i=> i.Role).ThenInclude(ti=> ti.UserCredentials)
				.Where(w=> w.Role.UserCredentials.Count(c=> c.EmployeeId== userEmployeeId)>0 && w.IsActive && !w.IsHidden && w.MenuPath != null)
				.Select(s=> s.MenuPath)
				.AsNoTracking()
				.ToListAsync();


			

			return userMenuPaths;
		}

		public async Task CreateUserMenuAccess(UserMenuAccess userMenu)
		{
			await context.UserMenuAccesses.AddAsync(userMenu);
		}

		public async Task UpdateUserMenuAccess(UserMenuAccess userMenu)
		{
			var menu = await context.UserMenuAccesses.FindAsync(userMenu.Id);

			if (menu != null)
			{
				menu.RoleId = userMenu.RoleId;
				menu.MenuName = userMenu.MenuName;
				menu.MenuPath = userMenu.MenuPath;
				menu.MenuIcon = userMenu.MenuIcon;
				menu.IsParent = userMenu.IsParent;
				menu.IsSubParent = userMenu.IsSubParent;
				menu.SectionMenuId = userMenu.SectionMenuId;
				menu.ParentId = userMenu.ParentId;
				menu.OrderBy = userMenu.OrderBy;
				menu.IsHidden = userMenu.IsHidden;
			}
		}

		public async Task RemoveUserMenuAccess(int menuId)
		{
			var menu = await context.UserMenuAccesses.FindAsync(menuId);

			if (menu != null)
			{
				menu.IsActive=false;
			}
		}

		public async Task DisableUserMenuAccess(int menuId, bool isHidden)
		{
			var menu = await context.UserMenuAccesses.FindAsync(menuId);

			if (menu != null)
			{
				menu.IsHidden = isHidden;
			}
		}

		public async Task<List<UserMenuDashboardDto>> RetrieveUserMenuAccessList()
		{
			var menus = await context.UserMenuAccesses
				.Include(i => i.Role)
				.Include(i => i.SectionMenu)
				.Where(x=>x.IsActive == true)
				.Select(s => new UserMenuDashboardDto()
				{
					Id = s.Id,
					IsActive = s.IsActive,
					IsParent = s.IsParent,
					IsSubParent = s.IsSubParent,
					MenuIcon = s.MenuIcon,
					MenuName = s.MenuName,
					MenuPath = s.MenuPath,
					OrderBy = s.OrderBy,
					ParentId = s.ParentId,
					Role = s.Role.Role,
					SectionMenu = s.SectionMenu.SectionName,
					IsHidden = s.IsHidden
				}).ToListAsync();
			return menus;
		}

		public async Task<UserMenuAccess> RetrieveUserMenuAccessInfo(int menuId)
		{
			var menu = await context.UserMenuAccesses.FindAsync(menuId);
			
			return menu;
		}
	}
}
