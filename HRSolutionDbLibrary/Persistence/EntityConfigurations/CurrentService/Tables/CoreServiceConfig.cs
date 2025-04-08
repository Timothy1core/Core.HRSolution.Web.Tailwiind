using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables
{
	public class CoreServiceConfig : IEntityTypeConfiguration<CoreService>
	{
		public void Configure(EntityTypeBuilder<CoreService> builder)
		{
			builder.Property(e => e.Alias)
				.IsRequired()
				.HasMaxLength(50);
			builder.Property(e => e.CreatedBy)
				.IsRequired()
				.HasMaxLength(50);
			builder.Property(e => e.CreatedDate).HasColumnType("datetime");
			builder.Property(e => e.IsActive).HasDefaultValue(true);
			builder.Property(e => e.Service)
				.IsRequired()
				.HasMaxLength(50);
		}
	}
}
