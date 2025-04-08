using HRSolutionDbLibrary.Core.Entities.Tables;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables;

public class AssessmentRemainingTimerConfig : IEntityTypeConfiguration<AssessmentRemainingTimer>
{
    public void Configure(EntityTypeBuilder<AssessmentRemainingTimer> builder)
    {
        builder.HasOne(d => d.Assessment).WithMany(p => p.AssessmentRemainingTimers)
            .HasForeignKey(d => d.AssessmentId)
            .OnDelete(DeleteBehavior.ClientSetNull)
            .HasConstraintName("FK_AssessmentRemainingTimers_Assessments");

        builder.HasOne(d => d.Candidate).WithMany(p => p.AssessmentRemainingTimers)
            .HasForeignKey(d => d.CandidateId)
            .OnDelete(DeleteBehavior.ClientSetNull)
            .HasConstraintName("FK_AssessmentRemainingTimers_Candidates");
    }
}