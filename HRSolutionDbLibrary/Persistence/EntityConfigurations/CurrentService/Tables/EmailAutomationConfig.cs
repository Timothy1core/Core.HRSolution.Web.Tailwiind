using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables
{
	internal class EmailAutomationConfig : IEntityTypeConfiguration<EmailAutomation>
	{
		public void Configure(EntityTypeBuilder<EmailAutomation> builder)
		{


			builder.Property(e => e.CreatedBy).HasMaxLength(50);
			builder.Property(e => e.CreatedDate).HasColumnType("datetime");
			builder.Property(e => e.IsActive).HasDefaultValue(true);

			builder.HasOne(d => d.Application).WithMany(p => p.EmailAutomations)
				.HasForeignKey(d => d.ApplicationId)
				.HasConstraintName("FK_EmailAutomations_ApplicationProcesses");

			builder.HasOne(d => d.EmailTemplateNavigation).WithMany(p => p.EmailAutomations)
				.HasForeignKey(d => d.EmailTemplate)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_EmailAutomations_EmailTemplates");

			builder.HasOne(d => d.Job).WithMany(p => p.EmailAutomations)
				.HasForeignKey(d => d.JobId)
				.HasConstraintName("FK_EmailAutomations_JobProfiles");
		}
	}
}
