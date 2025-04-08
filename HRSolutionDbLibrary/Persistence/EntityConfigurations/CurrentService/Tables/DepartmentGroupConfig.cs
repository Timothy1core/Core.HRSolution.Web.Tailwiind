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
	internal class DepartmentGroupConfig : IEntityTypeConfiguration<DepartmentGroup>
	{
		public void Configure(EntityTypeBuilder<DepartmentGroup> builder)
		{
			builder.Property(e => e.GroupName)
				.IsRequired()
				.HasMaxLength(500);
			builder.Property(e => e.IsActive).HasDefaultValue(true);
		}
	}
}
