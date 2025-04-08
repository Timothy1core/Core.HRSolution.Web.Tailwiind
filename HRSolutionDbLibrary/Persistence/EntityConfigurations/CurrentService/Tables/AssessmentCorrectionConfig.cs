using HRSolutionDbLibrary.Core.Entities.Tables;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables;

public class AssessmentCorrectionConfig : IEntityTypeConfiguration<AssessmentCorrection>
{
    public void Configure(EntityTypeBuilder<AssessmentCorrection> builder)
    {
        builder.Property(e => e.AnswerBody).IsRequired();
        builder.HasOne(d => d.Assessment).WithMany(p => p.AssessmentCorrections)
            .HasForeignKey(d => d.AssessmentId)
            .OnDelete(DeleteBehavior.ClientSetNull)
            .HasConstraintName("FK_AssessmentCorrections_Assessments");
    }
}