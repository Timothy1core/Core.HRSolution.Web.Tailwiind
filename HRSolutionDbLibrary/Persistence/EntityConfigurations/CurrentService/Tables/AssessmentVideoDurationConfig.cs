using HRSolutionDbLibrary.Core.Entities.Tables;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables;

public class AssessmentVideoDurationConfig : IEntityTypeConfiguration<AssessmentVideoDuration>
{
    public void Configure(EntityTypeBuilder<AssessmentVideoDuration> builder)
    {
		builder.HasKey(e => e.Id).HasName("AssessmentVideoDuration");

		builder.HasOne(d => d.AssessmentQuestion).WithMany(p => p.AssessmentVideoDurations)
			.HasForeignKey(d => d.QuestionId)
			.OnDelete(DeleteBehavior.ClientSetNull)
			.HasConstraintName("FK_AssessmentVideoDurations_AssessmentQuestions");
	}
}