using HRSolutionDbLibrary.Core.Entities.Tables;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables;

public class CandidateHistoryConfig : IEntityTypeConfiguration<CandidateHistory>
{
    public void Configure(EntityTypeBuilder<CandidateHistory> builder)
    {
		builder.Property(e => e.CreatedBy).HasMaxLength(50);
		builder.Property(e => e.CreatedDate).HasColumnType("datetime");
		builder.Property(e => e.Description).IsRequired();
		builder.Property(e => e.Name)
			.IsRequired()
			.HasMaxLength(250);
		builder.Property(e => e.Type)
			.IsRequired()
			.HasMaxLength(50);

		builder.HasOne(d => d.Candidate).WithMany(p => p.CandidateHistories)
			.HasForeignKey(d => d.CandidateId)
			.OnDelete(DeleteBehavior.ClientSetNull)
			.HasConstraintName("FK_CandidateHistories_Candidates_Id");
	}
}