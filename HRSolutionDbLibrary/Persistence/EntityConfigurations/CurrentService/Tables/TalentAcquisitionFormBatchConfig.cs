using HRSolutionDbLibrary.Core.Entities.Tables;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables
{
	internal class TalentAcquisitionFormBatchConfig : IEntityTypeConfiguration<TalentAcquisitionFormBatch>
	{
		public void Configure(EntityTypeBuilder<TalentAcquisitionFormBatch> builder)
		{
			builder.Property(e => e.ApprovalDate).HasColumnType("datetime");
			builder.Property(e => e.ApprovalIp).HasMaxLength(500);
			builder.Property(e => e.SendBy)
				.IsRequired()
				.HasMaxLength(50);
			builder.Property(e => e.SendDate).HasColumnType("datetime");

			builder.HasOne(d => d.ApproverDetail).WithMany(p => p.TalentAcquisitionFormBatches)
				.HasForeignKey(d => d.Approver)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_TalentAcquisitionFormBatches_ClientProfiles");
		}
	}
}
