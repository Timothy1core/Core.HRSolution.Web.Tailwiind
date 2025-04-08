using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables
{
	public class TalentAcquisitionFormConfig : IEntityTypeConfiguration<TalentAcquisitionForm>
	{
		public void Configure(EntityTypeBuilder<TalentAcquisitionForm> builder)
		{
			builder.Property(e => e.CreatedBy)
				.IsRequired()
				.HasMaxLength(50);
			builder.Property(e => e.CreatedDate).HasColumnType("datetime");
			builder.Property(e => e.Equipment)
				.IsRequired()
				.HasMaxLength(500);
			builder.Property(e => e.InterviewSchedule).HasMaxLength(500);
			builder.Property(e => e.RequestDate).HasColumnType("date");
			builder.Property(e => e.Schedule)
				.IsRequired()
				.HasMaxLength(500);
			builder.Property(e => e.TargetSalaryRange).HasMaxLength(500);
			builder.Property(e => e.TargetStartDate).HasColumnType("date");

			builder.HasOne(d => d.Department).WithMany(p => p.TalentAcquisitionForms)
				.HasForeignKey(d => d.DepartmentId)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_TalentAcquisitionForms_Departments_Id");

			builder.HasOne(d => d.HiringManagerNavigation).WithMany(p => p.TalentAcquisitionForms)
				.HasForeignKey(d => d.HiringManager)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_TalentAcquisitionForms_DepartmentIndividuals_Id");

			builder.HasOne(d => d.Job).WithMany(p => p.TalentAcquisitionForms)
				.HasForeignKey(d => d.JobId)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_TalentAcquisitionForms_JobProfiles");

			builder.HasOne(d => d.Reason).WithMany(p => p.TalentAcquisitionForms)
				.HasForeignKey(d => d.ReasonId)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_TalentAcquisitionForms_TalentAcquisitionReasons");

			builder.HasOne(d => d.Status).WithMany(p => p.TalentAcquisitionForms)
				.HasForeignKey(d => d.StatusId)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_TalentAcquisitionForms_TalentAcquisitionStatuses");

			builder.HasOne(d => d.TafBatch).WithMany(p => p.TalentAcquisitionForms)
				.HasForeignKey(d => d.TafBatchId)
				.HasConstraintName("FK_TalentAcquisitionForms_TalentAcquisitionFormBatches");

			builder.HasOne(d => d.WorkArrangementDetail).WithMany(p => p.TalentAcquisitionForms)
				.HasForeignKey(d => d.WorkArrangement)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_TalentAcquisitionForms_WorkArrangements");
		}
	}
}
