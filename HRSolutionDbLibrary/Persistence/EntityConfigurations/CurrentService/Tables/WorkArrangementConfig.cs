using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables
{
	public class WorkArrangementConfig : IEntityTypeConfiguration<WorkArrangement>
	{
		public void Configure(EntityTypeBuilder<WorkArrangement> builder)
		{
			builder.Property(e => e.Arrangement)
				.IsRequired()
				.HasMaxLength(500);
			builder.Property(e => e.CreatedBy)
				.IsRequired()
				.HasMaxLength(50);
			builder.Property(e => e.CreatedDate).HasColumnType("datetime");
			builder.Property(e => e.IsActive).HasDefaultValue(true);
		}
	}
}
