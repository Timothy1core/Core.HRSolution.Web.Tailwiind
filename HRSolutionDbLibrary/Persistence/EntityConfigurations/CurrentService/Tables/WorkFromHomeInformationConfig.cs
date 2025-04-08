using HRSolutionDbLibrary.Core.Entities.Tables;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables
{
	public class WorkFromHomeInformationConfig : IEntityTypeConfiguration<WorkFromHomeInformation>
	{
		public void Configure(EntityTypeBuilder<WorkFromHomeInformation> builder)
		{
			builder.HasKey(e => e.CandidateId).HasName("PK_WorkFromHomeInformations_CandidateId");

			builder.Property(e => e.CandidateId).ValueGeneratedNever();
			builder.Property(e => e.AvailabilityCall).HasMaxLength(500);
			builder.Property(e => e.DownloadInternetSpeed).HasMaxLength(500);
			builder.Property(e => e.InternetProvider).HasMaxLength(500);
			builder.Property(e => e.InternetService).HasMaxLength(500);
			builder.Property(e => e.PlatformVideoCall).HasMaxLength(500);
			builder.Property(e => e.SetUpWorkStation1).HasColumnName("SetUpWorkStation_1");
			builder.Property(e => e.SetUpWorkStation2).HasColumnName("SetUpWorkStation_2");
			builder.Property(e => e.SetUpWorkStation3).HasColumnName("SetUpWorkStation_3");
			builder.Property(e => e.SetUpWorkStation4).HasColumnName("SetUpWorkStation_4");
			builder.Property(e => e.SetUpWorkStation5).HasColumnName("SetUpWorkStation_5");
			builder.Property(e => e.SetUpWorkStation6).HasColumnName("SetUpWorkStation_6");
			builder.Property(e => e.SurroundAreas1).HasColumnName("SurroundAreas_1");
			builder.Property(e => e.SurroundAreas10).HasColumnName("SurroundAreas_10");
			builder.Property(e => e.SurroundAreas2).HasColumnName("SurroundAreas_2");
			builder.Property(e => e.SurroundAreas3).HasColumnName("SurroundAreas_3");
			builder.Property(e => e.SurroundAreas4).HasColumnName("SurroundAreas_4");
			builder.Property(e => e.SurroundAreas5).HasColumnName("SurroundAreas_5");
			builder.Property(e => e.SurroundAreas6).HasColumnName("SurroundAreas_6");
			builder.Property(e => e.SurroundAreas7).HasColumnName("SurroundAreas_7");
			builder.Property(e => e.SurroundAreas8).HasColumnName("SurroundAreas_8");
			builder.Property(e => e.SurroundAreas9).HasColumnName("SurroundAreas_9");
			builder.Property(e => e.UploadInternetSpeed).HasMaxLength(500);
			builder.Property(e => e.WorkFromHomeApproval1).HasColumnName("WorkFromHomeApproval_1");
			builder.Property(e => e.WorkFromHomeApprovalBy).HasMaxLength(50);
			builder.Property(e => e.WorkFromHomeApprovalBy1)
				.HasMaxLength(50)
				.HasColumnName("WorkFromHomeApprovalBy_1");
			builder.HasOne(d => d.Candidate).WithOne(p => p.WorkFromHomeInformation)
				.HasForeignKey<WorkFromHomeInformation>(d => d.CandidateId)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_WorkFromHomeInformations_Candidates");
		}
	}
}
