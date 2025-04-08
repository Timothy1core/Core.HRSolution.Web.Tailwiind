using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables
{
	internal class EmailActionConfig : IEntityTypeConfiguration<EmailAction>
	{
		public void Configure(EntityTypeBuilder<EmailAction> builder)
		{
			builder.Property(e => e.Id).ValueGeneratedNever();
			builder.Property(e => e.EmailAction1)
				.IsRequired()
				.HasMaxLength(50)
				.HasColumnName("EmailAction");
			builder.Property(e => e.IsActive).HasDefaultValue(true);
		}
	}
}
