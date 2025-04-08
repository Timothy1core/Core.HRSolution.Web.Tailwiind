using HRSolutionDbLibrary.Core.Entities.Tables;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables;

public class AssessmentChoiceConfig : IEntityTypeConfiguration<AssessmentChoice>
{
    public void Configure(EntityTypeBuilder<AssessmentChoice> builder)
    {
	    builder.HasKey(e => e.Id).HasName("PK_AssessmentChoices");
		builder.Property(e => e.ChoiceBody).IsRequired();

        builder.HasOne(d => d.AssessmentQuestion).WithMany(p => p.AssessmentChoices)
            .HasForeignKey(d => d.QuestionId)
            .OnDelete(DeleteBehavior.ClientSetNull)
            .HasConstraintName("FK_Choices_Questions");
    }
}