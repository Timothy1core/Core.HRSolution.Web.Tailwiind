using HRSolutionDbLibrary.Core.Entities.Tables;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables;

public class AssessmentQuestionTypeConfig : IEntityTypeConfiguration<AssessmentQuestionType>
{
    public void Configure(EntityTypeBuilder<AssessmentQuestionType> builder)
    {
        builder.HasKey(e => e.Id).HasName("PK_AssessmentQuestionType");

        builder.Property(e => e.TypeName)
            .IsRequired()
            .HasMaxLength(50)
            .IsUnicode(false);
        //
        // builder.HasOne(d => d.Question).WithMany(p => p.QuestionTypes)
        //     .HasForeignKey(d => d.QuestionId)
        //     .OnDelete(DeleteBehavior.ClientSetNull)
        //     .HasConstraintName("FK_QuestionTypes_Questions");
    }
}