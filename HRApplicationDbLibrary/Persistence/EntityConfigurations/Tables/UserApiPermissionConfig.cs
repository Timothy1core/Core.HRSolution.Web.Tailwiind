using HRApplicationDbLibrary.Core.Entities.Tables;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRApplicationDbLibrary.Persistence.EntityConfigurations.Tables
{
	public class UserApiPermissionConfig : IEntityTypeConfiguration<UserApiPermission>
	{
		public void Configure(EntityTypeBuilder<UserApiPermission> builder)
		{
			builder.HasKey(e => e.Id).HasName("PK_UserMenuActions");

			builder.HasOne(d => d.Api).WithMany(p => p.UserApiPermissions)
				.HasForeignKey(d => d.ApiId)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_UserApiPermissions_Apis1");

			builder.HasOne(d => d.Role).WithMany(p => p.UserApiPermissions)
				.HasForeignKey(d => d.RoleId)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_UserMenuPermissions_UserRoles");
		}
	}
}
