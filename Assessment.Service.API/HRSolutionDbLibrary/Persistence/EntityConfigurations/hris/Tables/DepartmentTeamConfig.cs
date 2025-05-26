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
    class DepartmentTeamConfig : IEntityTypeConfiguration<DepartmentTeam>
	{
		public void Configure(EntityTypeBuilder<DepartmentTeam> builder)
		{
			builder.HasKey(e => e.Id).HasName("PK_EmployeeTeams_Id");

			builder.Property(e => e.Alias)
				.IsRequired()
				.HasMaxLength(50);
			builder.Property(e => e.CreatedDate).HasColumnType("datetime");
			builder.Property(e => e.IsActive).HasDefaultValue(true);
			builder.Property(e => e.Name).IsRequired();

			builder.HasOne(d => d.Department).WithMany(p => p.DepartmentTeams)
				.HasForeignKey(d => d.DepartmentId)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_DepartmentTeams_Departments_Id");
		}
	}
}
