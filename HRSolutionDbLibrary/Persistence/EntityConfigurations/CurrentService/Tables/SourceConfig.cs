using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables
{
	public class SourceConfig : IEntityTypeConfiguration<Source>
	{
		public void Configure(EntityTypeBuilder<Source> builder)
		{
			builder.Property(e => e.CreatedDate).HasColumnType("datetime");
			builder.Property(e => e.IsActive).HasDefaultValue(true);
			builder.Property(e => e.SourceName)
				.IsRequired()
				.HasMaxLength(500);
		}
	}
}
