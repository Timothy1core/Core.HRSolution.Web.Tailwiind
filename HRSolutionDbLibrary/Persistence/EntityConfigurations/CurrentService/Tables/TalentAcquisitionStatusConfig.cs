using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables
{
	public class TalentAcquisitionStatusConfig : IEntityTypeConfiguration<TalentAcquisitionStatus>
	{
		public void Configure(EntityTypeBuilder<TalentAcquisitionStatus> builder)
		{
			builder.Property(e => e.CreatedDate).HasColumnType("datetime");
			builder.Property(e => e.IsActive).HasDefaultValue(true);
			builder.Property(e => e.Status)
				.IsRequired()
				.HasMaxLength(500);
		}
	}
}
