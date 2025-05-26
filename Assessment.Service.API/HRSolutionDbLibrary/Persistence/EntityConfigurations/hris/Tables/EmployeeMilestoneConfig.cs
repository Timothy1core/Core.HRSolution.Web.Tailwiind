using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HRSolutionDbLibrary.Core.Entities.hris.Tables;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables
{
	public class EmployeeMilestoneConfig : IEntityTypeConfiguration<EmployeeMilestone>
	{
		public void Configure(EntityTypeBuilder<EmployeeMilestone> builder)
		{
			builder.HasKey(e => e.EmployeeId);
			builder.Property(e => e.Date).HasColumnType("datetime");

			builder.HasOne(d => d.EmployeeInformation).WithOne(p => p.EmployeeMilestone)
				.HasForeignKey<EmployeeMilestone>(d => d.EmployeeId)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_EmployeeMilestones_EmployeeInformations");
		}
	}
}
