using HRSolutionDbLibrary.Core.Entities.application.Tables;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.applications.Tables
{
	public class UserCredentialConfig : IEntityTypeConfiguration<UserCredential>
	{
		public void Configure(EntityTypeBuilder<UserCredential> builder)
		{
			builder.Property(e => e.Email)
				.IsRequired()
				.HasMaxLength(500);
			builder.Property(e => e.IsActive)
				.IsRequired()
				.HasDefaultValueSql("((1))");
			builder.Property(e => e.Password).IsRequired();

			builder.HasOne(d => d.Role).WithMany(p => p.UserCredentials)
				.HasForeignKey(d => d.RoleId)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_UserCredentials_UserRoles");
		}
	}
}
