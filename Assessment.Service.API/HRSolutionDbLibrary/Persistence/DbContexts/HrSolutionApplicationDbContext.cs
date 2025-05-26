using HRSolutionDbLibrary.Core.DbContexts;
using HRSolutionDbLibrary.Core.Entities.application.Tables;
using HRSolutionDbLibrary.Core.Entities.application.Views;
using HRSolutionDbLibrary.Persistence.EntityConfigurations.applications.Tables;
using HRSolutionDbLibrary.Persistence.EntityConfigurations.applications.Views;
using Microsoft.EntityFrameworkCore;

namespace HRSolutionDbLibrary.Persistence.DbContexts
{
	public class HrSolutionApplicationDbContext (DbContextOptions<HrSolutionApplicationDbContext> options) : DbContext(options), IHrSolutionApplicationDbContext
	{
		public DbSet<Api> Apis { get; set; }
		public DbSet<UserCredential> UserCredentials { get; set; }
		public DbSet<SectionMenu> SectionMenus { get; set; }
		public DbSet<UserMenuAccess> UserMenuAccesses { get; set; }
		public DbSet<UserApiPermission> UserApiPermissions { get; set; }
		public DbSet<UserRole> UserRoles { get; set; }
		public DbSet<UserDetail> UserDetails{ get; set; }
		public DbSet<SystemOption> SystemOptions{ get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			modelBuilder.ApplyConfiguration(new ApiConfig());
			modelBuilder.ApplyConfiguration(new UserCredentialConfig());
			modelBuilder.ApplyConfiguration(new SectionMenuConfig());
			modelBuilder.ApplyConfiguration(new UserMenuAccessConfig());
			modelBuilder.ApplyConfiguration(new UserApiPermissionConfig());
			modelBuilder.ApplyConfiguration(new UserRoleConfig());
			modelBuilder.ApplyConfiguration(new UserDetailConfig());
			modelBuilder.ApplyConfiguration(new SystemOptionConfig());
			base.OnModelCreating(modelBuilder);
		}
	}
}
