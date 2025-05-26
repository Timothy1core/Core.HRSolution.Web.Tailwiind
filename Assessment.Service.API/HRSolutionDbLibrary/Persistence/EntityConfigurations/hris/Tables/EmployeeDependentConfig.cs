using HRSolutionDbLibrary.Core.Entities.hris.Tables;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables
{
	public class EmployeeDependentConfig : IEntityTypeConfiguration<EmployeeDependent>
	{
		public void Configure(EntityTypeBuilder<EmployeeDependent> builder)
		{
			builder.HasKey(e => e.EmployeeId);
			builder.Property(e => e.BirthDate).HasColumnType("datetime");
			builder.Property(e => e.Effectivity).HasColumnType("datetime");
			builder.HasOne(d => d.EmployeeInformation).WithOne(p => p.EmployeeDependent)
				.HasForeignKey<EmployeeDependent>(d => d.EmployeeId)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_EmployeeDependents_EmployeeInformations");
		}
	}
}
