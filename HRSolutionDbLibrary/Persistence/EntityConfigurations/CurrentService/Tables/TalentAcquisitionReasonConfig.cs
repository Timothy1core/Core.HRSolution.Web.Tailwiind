using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables
{
	public class TalentAcquisitionReasonConfig : IEntityTypeConfiguration<TalentAcquisitionReason>
	{
		public void Configure(EntityTypeBuilder<TalentAcquisitionReason> builder)
		{
			builder.Property(e => e.CreatedDate).HasColumnType("datetime");
			builder.Property(e => e.IsActive).HasDefaultValue(true);
			builder.Property(e => e.Reason)
				.IsRequired()
				.HasMaxLength(500);
		}
	}
}
