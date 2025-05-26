using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HRSolutionDbLibrary.Core.Entities.hris.Tables;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables
{
    class DepartmentTimeZoneConfig : IEntityTypeConfiguration<DepartmentTimeZone>
	{
		public void Configure(EntityTypeBuilder<DepartmentTimeZone> builder)
		{
			builder.HasKey(e => e.Id).HasName("PK_TimeZones_Id");

			builder.Property(e => e.Alias).HasMaxLength(50);
			builder.Property(e => e.CreatedBy).HasMaxLength(50);
			builder.Property(e => e.CreatedDate).HasColumnType("datetime");
			builder.Property(e => e.IanaTimeZoneId).HasMaxLength(255);
			builder.Property(e => e.MnlOffset).HasMaxLength(6);
			builder.Property(e => e.Name).HasMaxLength(255);
		}
	}
}
