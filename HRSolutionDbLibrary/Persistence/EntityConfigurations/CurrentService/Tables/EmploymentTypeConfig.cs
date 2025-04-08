using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables
{
	public class EmploymentTypeConfig : IEntityTypeConfiguration<EmploymentType>
	{
		public void Configure(EntityTypeBuilder<EmploymentType> builder)
		{
			builder.Property(e => e.CreatedBy)
				.IsRequired()
				.HasMaxLength(50);
			builder.Property(e => e.CreatedDate).HasColumnType("datetime");
			builder.Property(e => e.IsActive).HasDefaultValue(true);
			builder.Property(e => e.TypeName)
				.IsRequired()
				.HasMaxLength(50);
		}
	}
}
