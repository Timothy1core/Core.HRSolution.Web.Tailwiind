using HRApplicationDbLibrary.Core.DbContexts;
using HRApplicationDbLibrary.Core.Entities.Tables;
using HRApplicationDbLibrary.Core.Entities.Views;
using HRApplicationDbLibrary.Persistence.EntityConfigurations.Tables;
using HRApplicationDbLibrary.Persistence.EntityConfigurations.Views;
using Microsoft.EntityFrameworkCore;

namespace HRApplicationDbLibrary.Persistence.DbContexts
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
