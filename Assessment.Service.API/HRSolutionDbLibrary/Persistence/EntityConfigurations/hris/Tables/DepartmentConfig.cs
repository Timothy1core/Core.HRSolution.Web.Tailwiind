using HRSolutionDbLibrary.Core.Entities.hris.Tables;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables
{
	public class DepartmentConfig : IEntityTypeConfiguration<Department>
	{
		public void Configure(EntityTypeBuilder<Department> builder)
		{
			builder.HasKey(e => e.Id).HasName("PK_ClientCompanies");

			builder.Property(e => e.Alias).HasMaxLength(500);
			builder.Property(e => e.CreatedBy).HasMaxLength(50);
			builder.Property(e => e.CreatedDate).HasColumnType("datetime");
			builder.Property(e => e.IsActive).HasDefaultValue(true);
			builder.Property(e => e.Logo).IsRequired();
			builder.Property(e => e.Name)
				.IsRequired()
				.HasMaxLength(1000);

			builder.HasOne(d => d.CoreService).WithMany(p => p.Departments)
				.HasForeignKey(d => d.CoreServiceId)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_Departments_CoreServices_Id");

			builder.HasOne(d => d.DepartmentGroup).WithMany(p => p.Departments)
				.HasForeignKey(d => d.DepartmentGroupId)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_Departments_DepartmentGroups_Id");

			builder.HasOne(d => d.DepartmentStatus).WithMany(p => p.Departments)
				.HasForeignKey(d => d.DepartmentStatusId)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_Departments_DepartmentStatuses_Id");

			builder.HasOne(d => d.Industry).WithMany(p => p.Departments)
				.HasForeignKey(d => d.IndustryId)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_Departments_Industries_Id");

			builder.HasOne(d => d.Timezone).WithMany(p => p.Departments)
				.HasForeignKey(d => d.TimezoneId)
				.HasConstraintName("FK_Departments_TimeZones_Id");

		}
	}
}
