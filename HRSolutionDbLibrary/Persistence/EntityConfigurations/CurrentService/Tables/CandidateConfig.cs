using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables
{
	public class CandidateConfig : IEntityTypeConfiguration<Candidate>
	{
		public void Configure(EntityTypeBuilder<Candidate> builder)
		{

			builder.Property(e => e.CurrentEmploymentStatus).HasMaxLength(1500);
			builder.Property(e => e.CurrentSalary).HasMaxLength(1500);
			builder.Property(e => e.Email)
				.IsRequired()
				.HasMaxLength(1500);
			builder.Property(e => e.ExpectedSalary).HasMaxLength(1500);
			builder.Property(e => e.FirstName)
				.IsRequired()
				.HasMaxLength(1500);
			builder.Property(e => e.IsActive).HasDefaultValue(true);
			builder.Property(e => e.LastName)
				.IsRequired()
				.HasMaxLength(1500);
			builder.Property(e => e.NoticePeriod).HasMaxLength(1500);
			builder.Property(e => e.PhoneNumber)
				.IsRequired()
				.HasMaxLength(1500);
			builder.Property(e => e.Resume)
				.IsRequired()
				.HasMaxLength(1500);

			builder.HasOne(d => d.Job).WithMany(p => p.Candidates)
				.HasForeignKey(d => d.JobId)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_Candidates_JobProfiles");

			builder.HasOne(d => d.Source).WithMany(p => p.Candidates)
				.HasForeignKey(d => d.SourceId)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_Candidates_Sources");
		}
	}
}
