using HRApplicationDbLibrary.Core.Entities.Tables;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRApplicationDbLibrary.Persistence.EntityConfigurations.Tables
{
	public class UserMenuAccessConfig : IEntityTypeConfiguration<UserMenuAccess>
	{
		public void Configure(EntityTypeBuilder<UserMenuAccess> builder)
		{
			builder.ToTable("UserMenuAccess");

			builder.Property(e => e.CreatedBy).HasMaxLength(50);
			builder.Property(e => e.CreatedDate).HasColumnType("datetime");
			builder.Property(e => e.IsActive)
				.IsRequired()
				.HasDefaultValueSql("((1))");
			builder.Property(e => e.IsParent)
				.IsRequired()
				.HasDefaultValueSql("((1))");
			builder.Property(e => e.IsHidden)
				.IsRequired();
			builder.Property(e => e.MenuIcon).HasMaxLength(100);
			builder.Property(e => e.MenuName)
				.IsRequired()
				.HasMaxLength(50);
			builder.Property(e => e.MenuPath).HasMaxLength(100);

			builder.HasOne(d => d.Role).WithMany(p => p.UserMenuAccesses)
				.HasForeignKey(d => d.RoleId)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_UserMenuAccess_UserRoles");
		}
	}
}
