using HRSolutionDbLibrary.Core.Entities.Tables;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables;

public class CandidateCredentialConfig : IEntityTypeConfiguration<CandidateCredential>
{
    public void Configure(EntityTypeBuilder<CandidateCredential> builder)
    {
        builder.Property(e => e.Email)
            .IsRequired()
            .HasMaxLength(500);
        builder.Property(e => e.Expiration).HasColumnType("datetime");
        builder.Property(e => e.Password).IsRequired();
        builder.HasOne(d => d.AssessmentRemainingTimer).WithMany(p => p.CandidateCredentials)
            .HasForeignKey(d => d.AssessmentTimerId)
            .HasConstraintName("FK_CandidateCredentials_AssessmentRemainingTimers");

        builder.HasOne(d => d.Candidate).WithMany(p => p.CandidateCredentials)
            .HasForeignKey(d => d.CandidateId)
            .OnDelete(DeleteBehavior.ClientSetNull)
            .HasConstraintName("FK_CandidateCredentials_Candidates");
    }
}