using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables
{
	public class JobApplicationChoiceConfig : IEntityTypeConfiguration<JobApplicationChoice>
	{
		public void Configure(EntityTypeBuilder<JobApplicationChoice> builder)
		{
			builder.Property(e => e.Body)
				.IsRequired()
				.HasMaxLength(500);
			builder.Property(e => e.IsActive).HasDefaultValue(true);

			builder.HasOne(d => d.ApplicationQuestion).WithMany(p => p.JobApplicationChoices)
				.HasForeignKey(d => d.ApplicationQuestionId)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_JobApplicationChoices_JobApplicationQuestions");
		}
	}
}
