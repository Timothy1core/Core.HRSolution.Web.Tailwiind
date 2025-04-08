using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables
{
	public class DepartmentStatusConfig : IEntityTypeConfiguration<DepartmentStatus>
	{
		public void Configure(EntityTypeBuilder<DepartmentStatus> builder)
		{
			builder.Property(e => e.CreatedBy)
				.IsRequired()
				.HasMaxLength(50);
			builder.Property(e => e.CreatedDate).HasColumnType("datetime");
			builder.Property(e => e.IsActive).HasDefaultValue(true);
			builder.Property(e => e.Status)
				.IsRequired()
				.HasMaxLength(500);
		}
	}
}
