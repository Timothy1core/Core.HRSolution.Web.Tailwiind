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
    class DepartmentIndustryConfig : IEntityTypeConfiguration<DepartmentIndustry>
	{
		public void Configure(EntityTypeBuilder<DepartmentIndustry> builder)
		{
			builder.HasKey(e => e.Id).HasName("PK_Industries_Id");

			builder.Property(e => e.CreatedDate).HasColumnType("datetime");
			builder.Property(e => e.Name).HasMaxLength(255);
		}
	}
}
