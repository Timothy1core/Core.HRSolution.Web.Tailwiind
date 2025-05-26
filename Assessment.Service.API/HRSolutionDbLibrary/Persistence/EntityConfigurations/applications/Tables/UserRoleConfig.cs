using HRSolutionDbLibrary.Core.Entities.application.Tables;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.applications.Tables
{
	public class UserRoleConfig : IEntityTypeConfiguration<UserRole>
	{
		public void Configure(EntityTypeBuilder<UserRole> builder)
		{
			builder.Property(e => e.CreatedBy)
				.IsRequired()
				.HasMaxLength(50);
			builder.Property(e => e.CreatedDate).HasColumnType("datetime");
			builder.Property(e => e.IsActive)
				.IsRequired()
				.HasDefaultValueSql("((1))");
			builder.Property(e => e.Role)
				.IsRequired()
				.HasMaxLength(500);
		}
	}
}
