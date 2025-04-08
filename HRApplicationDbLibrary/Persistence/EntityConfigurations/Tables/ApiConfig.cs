using HRApplicationDbLibrary.Core.Entities.Tables;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRApplicationDbLibrary.Persistence.EntityConfigurations.Tables
{
	public class ApiConfig : IEntityTypeConfiguration<Api>
	{
		public void Configure(EntityTypeBuilder<Api> builder)
		{
			builder.Property(e => e.ApiPermission)
				.IsRequired()
				.HasMaxLength(50);
			builder.Property(e => e.CreatedBy)
				.IsRequired()
				.HasMaxLength(50);
			builder.Property(e => e.CreatedDate)
				.HasDefaultValueSql("(dateadd(hour,(8),getutcdate()))")
				.HasColumnType("datetime");
			builder.Property(e => e.IsActive).HasDefaultValue(true);
		}
	}
}
