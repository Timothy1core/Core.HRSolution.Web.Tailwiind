using HRSolutionDbLibrary.Core.Entities.Tables;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables;

public class AssessmentAnswerConfig : IEntityTypeConfiguration<AssessmentAnswer>
{
    public void Configure(EntityTypeBuilder<AssessmentAnswer> builder)
    {
		builder.HasKey(e => e.Id).HasName("PK_AssessmentAnswers");

		builder.Property(e => e.AnswerBody).IsRequired();

		builder.HasOne(d => d.Question).WithMany(p => p.AssessmentAnswers)
			.HasForeignKey(d => d.QuestionId)
			.OnDelete(DeleteBehavior.ClientSetNull)
			.HasConstraintName("FK_AssessmentAnswers_AssessmentQuestions");
	}
}