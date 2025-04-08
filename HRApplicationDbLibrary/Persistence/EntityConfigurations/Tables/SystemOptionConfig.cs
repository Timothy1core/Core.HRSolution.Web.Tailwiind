using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HRApplicationDbLibrary.Core.Entities.Tables;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRApplicationDbLibrary.Persistence.EntityConfigurations.Tables
{
	public class SystemOptionConfig : IEntityTypeConfiguration<SystemOption>
	{
		public void Configure(EntityTypeBuilder<SystemOption> builder)
		{
			builder.Property(e => e.CreatedBy)
				.IsRequired()
				.HasMaxLength(50);
			builder.Property(e => e.CreatedDate).HasColumnType("datetime");
			builder.Property(e => e.Name)
				.IsRequired()
				.HasMaxLength(500);
			builder.Property(e => e.Value)
				.IsRequired()
				.HasMaxLength(500);
		}
	}
}
