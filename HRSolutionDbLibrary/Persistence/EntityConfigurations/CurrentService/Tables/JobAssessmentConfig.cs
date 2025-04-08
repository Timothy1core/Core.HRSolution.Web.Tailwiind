using Microsoft.EntityFrameworkCore;
using HRSolutionDbLibrary.Core.Entities.Tables;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables
{
    internal class JobAssessmentConfig : IEntityTypeConfiguration<JobAssessment>
    {
        public void Configure(EntityTypeBuilder<JobAssessment> builder)
        {
            builder.Property(e => e.CreatedBy)
                .IsRequired()
                .HasMaxLength(50);
            builder.Property(e => e.CreatedDate).HasColumnType("datetime");

            builder.HasOne(d => d.Assessment).WithMany(p => p.JobAssessments)
                .HasForeignKey(d => d.AssessmentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_JobAssessments_Assessments");

            builder.HasOne(d => d.Job).WithMany(p => p.JobAssessments)
                .HasForeignKey(d => d.JobId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_JobAssessments_JobProfiles");
        }
    }
}
