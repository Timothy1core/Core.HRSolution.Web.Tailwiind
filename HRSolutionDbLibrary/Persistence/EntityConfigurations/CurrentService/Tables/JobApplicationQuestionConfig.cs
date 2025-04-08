using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables
{
	public class JobApplicationQuestionConfig : IEntityTypeConfiguration<JobApplicationQuestion>
	{
		public void Configure(EntityTypeBuilder<JobApplicationQuestion> builder)
		{
			builder.Property(e => e.Body).IsRequired();
			builder.Property(e => e.IsActive).HasDefaultValue(true);
			builder.Property(e => e.Type)
				.IsRequired()
				.HasMaxLength(500);

			builder.HasOne(d => d.Job).WithMany(p => p.JobApplicationQuestions)
				.HasForeignKey(d => d.JobId)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_JobApplicationQuestions_JobProfiles");
		}
	}
}
