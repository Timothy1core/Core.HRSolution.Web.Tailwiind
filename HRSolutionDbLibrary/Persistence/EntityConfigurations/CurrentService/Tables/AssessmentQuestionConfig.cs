using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables;

public class AssessmentQuestionConfig : IEntityTypeConfiguration<AssessmentQuestion>
{
	public void Configure(EntityTypeBuilder<AssessmentQuestion> builder)
	{
		builder.Property(e => e.Body).IsRequired();

		builder.HasOne(d => d.Assessment).WithMany(p => p.AssessmentQuestions)
			.HasForeignKey(d => d.AssessmentId)
			.OnDelete(DeleteBehavior.ClientSetNull)
			.HasConstraintName("FK_Questions_Assessments");
	}
}