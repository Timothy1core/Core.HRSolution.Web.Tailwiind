using HRApplicationDbLibrary.Core.Entities.Views;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRApplicationDbLibrary.Persistence.EntityConfigurations.Views
{
	public class UserDetailConfig : IEntityTypeConfiguration<UserDetail>
	{
		public void Configure(EntityTypeBuilder<UserDetail> builder)
		{
			builder
				.HasNoKey()
				.ToView("UserDetails");

			builder.Property(e => e.CompanyEmail).HasMaxLength(50);
			builder.Property(e => e.DateHired).HasColumnType("date");
			builder.Property(e => e.EmployeeId)
				.IsRequired()
				.HasMaxLength(50);
			builder.Property(e => e.EmploymentStatus).HasMaxLength(50);
			builder.Property(e => e.FirstName)
				.IsRequired()
				.HasMaxLength(500);
			builder.Property(e => e.Gender)
				.IsRequired()
				.HasMaxLength(50);
			builder.Property(e => e.LastName)
				.IsRequired()
				.HasMaxLength(500);
			builder.Property(e => e.MiddleNamePrefix).HasMaxLength(500);
			builder.Property(e => e.Salutation)
				.IsRequired()
				.HasMaxLength(50);
			builder.Property(e => e.YearId)
				.IsRequired()
				.HasMaxLength(50);
		}
	}
}
