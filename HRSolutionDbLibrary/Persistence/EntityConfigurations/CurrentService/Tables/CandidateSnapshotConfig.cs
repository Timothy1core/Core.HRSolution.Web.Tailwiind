using HRSolutionDbLibrary.Core.Entities.Tables;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables;

public class CandidateSnapshotConfig : IEntityTypeConfiguration<CandidateSnapshot>
{
    public void Configure(EntityTypeBuilder<CandidateSnapshot> builder)
    {
        builder.ToTable("CandidateSnapshot");
        builder.Property(e => e.FilePath).IsRequired();

        builder.HasOne(d => d.Candidate).WithMany(p => p.CandidateSnapshots)
            .HasForeignKey(d => d.CandidateId)
            .OnDelete(DeleteBehavior.ClientSetNull)
            .HasConstraintName("FK_CandidateSnapshot_Candidates");
    }
}