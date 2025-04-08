using HRSolutionDbLibrary.Core.Entities.Tables;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables;

public class JobOfferStatusConfig : IEntityTypeConfiguration<JobOfferStatus>
{
	public void Configure(EntityTypeBuilder<JobOfferStatus> builder)
	{
		builder.ToTable("JobOfferStatus");
		builder.Property(e => e.CreatedBy).HasMaxLength(50);
		builder.Property(e => e.CreatedDate).HasColumnType("datetime");
		builder.Property(e => e.Status).HasMaxLength(50);
	}
}