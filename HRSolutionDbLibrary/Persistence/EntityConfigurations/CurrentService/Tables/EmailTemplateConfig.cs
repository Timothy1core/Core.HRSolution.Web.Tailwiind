using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables
{
	internal class EmailTemplateConfig : IEntityTypeConfiguration<EmailTemplate>
	{
		public void Configure(EntityTypeBuilder<EmailTemplate> builder)
		{
			builder.Property(e => e.Id);
			builder.Property(e => e.CreatedBy).HasMaxLength(50);
			builder.Property(e => e.CreatedDate).HasColumnType("datetime");
			builder.Property(e => e.EmailBody).IsRequired();
			builder.Property(e => e.IsActive).HasDefaultValue(true);
			builder.Property(e => e.Name)
				.IsRequired()
				.HasMaxLength(500);
			builder.Property(e => e.Subject)
				.IsRequired()
				.HasMaxLength(500);

			builder.HasOne(d => d.EmailAction).WithMany(p => p.EmailTemplates)
				.HasForeignKey(d => d.EmailActionId)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_EmailTemplates_EmailActions");
		}
	}
}
