using HRSolutionDbLibrary.Core.Entities.application.Tables;
using HRSolutionDbLibrary.Core.Entities.application.Views;
using Microsoft.EntityFrameworkCore;

namespace HRSolutionDbLibrary.Core.DbContexts;

public interface IHrSolutionApplicationDbContext
{
	DbSet<Api> Apis { get; set; }
	DbSet<UserCredential> UserCredentials { get; set; }
	DbSet<SectionMenu> SectionMenus { get; set; }
	DbSet<UserMenuAccess> UserMenuAccesses { get; set; }
	DbSet<UserApiPermission> UserApiPermissions { get; set; }
	DbSet<UserRole> UserRoles { get; set; }
	DbSet<UserDetail> UserDetails { get; set; }

	DbSet<SystemOption> SystemOptions { get; set; }

}