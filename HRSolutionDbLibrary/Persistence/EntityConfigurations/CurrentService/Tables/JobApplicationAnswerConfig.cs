using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables
{
	public class JobApplicationAnswerConfig : IEntityTypeConfiguration<JobApplicationAnswer>
	{
		public void Configure(EntityTypeBuilder<JobApplicationAnswer> builder)
		{
			builder.Property(e => e.Answer)
				.IsRequired()
				.HasMaxLength(10)
				.IsFixedLength();

			builder.HasOne(d => d.ApplicationQuestion).WithMany(p => p.JobApplicationAnswers)
				.HasForeignKey(d => d.ApplicationQuestionId)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_JobApplicationAnswers_JobApplicationQuestions");

			builder.HasOne(d => d.Candidate).WithMany(p => p.JobApplicationAnswers)
				.HasForeignKey(d => d.CandidateId)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_JobApplicationAnswers_Candidates");
		}
	}
}
