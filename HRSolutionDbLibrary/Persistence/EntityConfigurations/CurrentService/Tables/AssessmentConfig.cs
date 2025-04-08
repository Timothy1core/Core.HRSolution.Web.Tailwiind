using HRSolutionDbLibrary.Core.Entities.Tables;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables;

public class AssessmentConfig : IEntityTypeConfiguration<Assessment>
{
	public void Configure(EntityTypeBuilder<Assessment> builder)
	{
		builder.Property(e => e.CreatedDate).HasColumnType("datetime");
		builder.Property(e => e.CreatedBy)
			.IsRequired()
			.HasMaxLength(50);
		builder.Property(e => e.ModifiedDate).HasColumnType("datetime");
		builder.Property(e => e.ModifiedBy)
			.HasMaxLength(50);
		builder.Property(e => e.Description);
		builder.Property(e => e.Instruction).IsRequired();
		builder.Property(e => e.Name)
			.IsRequired()
			.HasMaxLength(100)
			.IsUnicode(false);
	}
}