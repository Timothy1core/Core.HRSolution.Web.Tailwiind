using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables
{
	public class JobApplicationProcessConfig : IEntityTypeConfiguration<JobApplicationProcess>
	{
		public void Configure(EntityTypeBuilder<JobApplicationProcess> builder)
		{
			builder.Property(e => e.IsActive).HasDefaultValue(true);

			builder.HasOne(d => d.ApplicationProcess).WithMany(p => p.JobApplicationProcesses)
				.HasForeignKey(d => d.ApplicationProcessId)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_JobApplicationProcesses_ApplicationProcesses");

			builder.HasOne(d => d.Job).WithMany(p => p.JobApplicationProcesses)
				.HasForeignKey(d => d.JobId)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_JobApplicationProcesses_JobProfiles");
		}
	}
}
