using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables
{
	public class DepartmentIndividualConfig : IEntityTypeConfiguration<DepartmentIndividual>
	{
		public void Configure(EntityTypeBuilder<DepartmentIndividual> builder)
		{
			builder.Property(e => e.Email).IsRequired();
			builder.Property(e => e.IsActive).HasDefaultValue(true);
			builder.Property(e => e.Name).IsRequired();

			builder.HasOne(d => d.Department).WithMany(p => p.DepartmentIndividuals)
				.HasForeignKey(d => d.DepartmentId)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_ClientProfiles_ClientCompanies");
		}
	}
}
