using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables
{
	public class ApplicationProcessConfig : IEntityTypeConfiguration<ApplicationProcess>
	{
		public void Configure(EntityTypeBuilder<ApplicationProcess> builder)
		{
			builder.Property(e => e.CreatedBy)
				.IsRequired()
				.HasMaxLength(50);
			builder.Property(e => e.CreatedDate).HasColumnType("datetime");
			builder.Property(e => e.IsActive).HasDefaultValue(true);
			builder.Property(e => e.ProcessName)
				.IsRequired()
				.HasMaxLength(500);
		}
	}
}
