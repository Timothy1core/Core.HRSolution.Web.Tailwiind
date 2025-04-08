using HRSolutionDbLibrary.Core.Entities.Tables;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables;

public class CandidateAnswerConfig : IEntityTypeConfiguration<CandidateAnswer>
{
    public void Configure(EntityTypeBuilder<CandidateAnswer> builder)
    {
		builder.HasKey(e => e.Id).HasName("PK_CandidateAnswers");

		builder.HasOne(d => d.Candidate).WithMany(p => p.CandidateAnswers)
			.HasForeignKey(d => d.CandidateId)
			.OnDelete(DeleteBehavior.ClientSetNull)
			.HasConstraintName("FK_CandidateAnswers_Candidates");

		builder.HasOne(d => d.AssessmentQuestion).WithMany(p => p.CandidateAnswers)
			.HasForeignKey(d => d.QuestionId)
			.OnDelete(DeleteBehavior.ClientSetNull)
			.HasConstraintName("FK_CandidateAnswers_AssessmentQuestions");
	}
}