using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables
{
	public class JobProfileConfig : IEntityTypeConfiguration<JobProfile>
	{
		public void Configure(EntityTypeBuilder<JobProfile> builder)
		{
			builder.Property(e => e.CreatedBy)
				.IsRequired()
				.HasMaxLength(50);
			builder.Property(e => e.CreatedDate).HasColumnType("datetime");
			builder.Property(e => e.IsActive).HasDefaultValue(true);
			builder.Property(e => e.Position).IsRequired();
			builder.Property(e => e.ShowInCareerPage).HasDefaultValue(true);

			builder.HasOne(d => d.Department).WithMany(p => p.JobProfiles)
				.HasForeignKey(d => d.DepartmentId)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_JobProfiles_ClientCompanies");

			builder.HasOne(d => d.EmploymentType).WithMany(p => p.JobProfiles)
				.HasForeignKey(d => d.EmploymentTypeId)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_JobProfiles_EmploymentTypes");

			builder.HasOne(d => d.JobStatus).WithMany(p => p.JobProfiles)
				.HasForeignKey(d => d.JobStatusId)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_JobProfiles_JobStatuses");
		}
	}
}
