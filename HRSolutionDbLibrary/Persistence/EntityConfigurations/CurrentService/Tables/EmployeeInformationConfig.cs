using HRSolutionDbLibrary.Core.Entities.Tables;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables;

public class EmployeeInformationConfig : IEntityTypeConfiguration<EmployeeInformation>
{
	public void Configure(EntityTypeBuilder<EmployeeInformation> builder)
	{
		builder.HasKey(e => e.EmployeeId).HasName("PK_EmployeeInformations_1");

		builder.Property(e => e.EmployeeId).HasMaxLength(50);
		builder.Property(e => e.AlternativeMobileNo).HasMaxLength(50);
		builder.Property(e => e.Bank).HasMaxLength(50);
		builder.Property(e => e.BankAccount).HasMaxLength(50);
		builder.Property(e => e.BankBranch).HasMaxLength(50);
		builder.Property(e => e.CivilStatus)
			.IsRequired()
			.HasMaxLength(50);
		builder.Property(e => e.ClearedDate).HasColumnType("date");
		builder.Property(e => e.CompanyEmail).HasMaxLength(50);
		builder.Property(e => e.ContractType).HasMaxLength(50);
		builder.Property(e => e.CurrentAddress)
			.IsRequired()
			.HasMaxLength(500);
		builder.Property(e => e.CurrentCityProvince)
			.IsRequired()
			.HasMaxLength(500);
		builder.Property(e => e.CurrentLocation)
			.IsRequired()
			.HasMaxLength(500);
		builder.Property(e => e.CurrentZipcode)
			.IsRequired()
			.HasMaxLength(50);
		builder.Property(e => e.DateHired).HasColumnType("date");
		builder.Property(e => e.DateOfBirth).HasColumnType("date");
		builder.Property(e => e.EducationalAttainment)
			.IsRequired()
			.HasMaxLength(500);
		builder.Property(e => e.EmergencyContactNo)
			.IsRequired()
			.HasMaxLength(50);
		builder.Property(e => e.EmergencyContactPerson)
			.IsRequired()
			.HasMaxLength(50);
		builder.Property(e => e.EmergencyRelation)
			.IsRequired()
			.HasMaxLength(50);
		builder.Property(e => e.EmployeeLevel).HasMaxLength(50);
		builder.Property(e => e.EmploymentStatus).HasMaxLength(50);
		builder.Property(e => e.FirstName)
			.IsRequired()
			.HasMaxLength(500);
		builder.Property(e => e.Gender)
			.IsRequired()
			.HasMaxLength(50);
		builder.Property(e => e.ImmediateSuperior).HasMaxLength(50);
		builder.Property(e => e.LandlineNo).HasMaxLength(50);
		builder.Property(e => e.LastName)
			.IsRequired()
			.HasMaxLength(500);
		builder.Property(e => e.LastPayReleaseDate).HasColumnType("date");
		builder.Property(e => e.LeaveBenefitType).HasMaxLength(50);
		builder.Property(e => e.MiddleName).HasMaxLength(500);
		builder.Property(e => e.MiddleNamePrefix).HasMaxLength(500);
		builder.Property(e => e.MobileNo)
			.IsRequired()
			.HasMaxLength(50);
		builder.Property(e => e.Pagibig).HasMaxLength(50);
		builder.Property(e => e.PermanentAddress)
			.IsRequired()
			.HasMaxLength(500);
		builder.Property(e => e.PermanentCityProvince)
			.IsRequired()
			.HasMaxLength(500);
		builder.Property(e => e.PermanentLocation)
			.IsRequired()
			.HasMaxLength(500);
		builder.Property(e => e.PermanentZipcode)
			.IsRequired()
			.HasMaxLength(50);
		builder.Property(e => e.PersonalEmail)
			.IsRequired()
			.HasMaxLength(50);
		builder.Property(e => e.Philhealth).HasMaxLength(50);
		builder.Property(e => e.Position)
			.IsRequired()
			.HasMaxLength(50);
		builder.Property(e => e.ReasonForLeaving).HasMaxLength(50);
		builder.Property(e => e.RegularizationDate).HasColumnType("date");
		builder.Property(e => e.Remarks).HasMaxLength(50);
		builder.Property(e => e.Salutation)
			.IsRequired()
			.HasMaxLength(50);
		builder.Property(e => e.SeparationDate).HasColumnType("date");
		builder.Property(e => e.Sss).HasMaxLength(50);
		builder.Property(e => e.Suffix).HasMaxLength(50);
		builder.Property(e => e.Tin).HasMaxLength(50);
		builder.Property(e => e.WorkHours).HasColumnType("decimal(18, 2)");
		builder.Property(e => e.WorkSetup).HasMaxLength(50);
		builder.Property(e => e.YearId)
			.IsRequired()
			.HasMaxLength(50);
	}
}