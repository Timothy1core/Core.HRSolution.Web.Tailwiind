using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables
{
	public class DepartmentConfig : IEntityTypeConfiguration<Department>
	{
		public void Configure(EntityTypeBuilder<Department> builder)
		{
			builder.Property(e => e.Alias).HasMaxLength(500);
			builder.Property(e => e.CreatedBy).HasMaxLength(50);
			builder.Property(e => e.CreatedDate).HasColumnType("datetime");
			builder.Property(e => e.Industry)
				.IsRequired()
				.HasMaxLength(1000);
			builder.Property(e => e.IsActive).HasDefaultValue(true);
			builder.Property(e => e.Logo).IsRequired();
			builder.Property(e => e.Name)
				.IsRequired()
				.HasMaxLength(1000);
			builder.Property(e => e.Timezone).HasMaxLength(500);
			builder.Property(e => e.TimezoneOffset).HasMaxLength(6);



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

		}
	}
}
