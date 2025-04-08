using HRSolutionDbLibrary.Core.Entities.Tables;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables
{
	class OnboardingInformationSheetConfig : IEntityTypeConfiguration<OnboardingInformationSheet>
	{
		public void Configure(EntityTypeBuilder<OnboardingInformationSheet> builder)
		{
			builder.HasKey(e => e.CandidateId).HasName("PK_OnboardingInformationSheet_CandidateId");

			builder.ToTable("OnboardingInformationSheet");

			builder.Property(e => e.CandidateId).ValueGeneratedNever();
			builder.Property(e => e.AlternativeMobileNo).HasMaxLength(50);
			builder.Property(e => e.CivilStatus)
				.IsRequired()
				.HasMaxLength(500);
			builder.Property(e => e.CompanyEmail).HasMaxLength(500);
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
				.HasMaxLength(500);
			builder.Property(e => e.DateOfBirth).HasColumnType("datetime");
			builder.Property(e => e.EducationalAttainment)
				.IsRequired()
				.HasMaxLength(500);
			builder.Property(e => e.EmergencyContactNo)
				.IsRequired()
				.HasMaxLength(50);
			builder.Property(e => e.EmergencyContactPerson)
				.IsRequired()
				.HasMaxLength(500);
			builder.Property(e => e.EmergencyRelation)
				.IsRequired()
				.HasMaxLength(50);
			builder.Property(e => e.FirstName)
				.IsRequired()
				.HasMaxLength(500);
			builder.Property(e => e.Gender)
				.IsRequired()
				.HasMaxLength(50);
			builder.Property(e => e.LandlineNo).HasMaxLength(50);
			builder.Property(e => e.LastName)
				.IsRequired()
				.HasMaxLength(500);
			builder.Property(e => e.MiddleName).HasMaxLength(500);
			builder.Property(e => e.MiddleNamePrefix).HasMaxLength(50);
			builder.Property(e => e.MobileNo)
				.IsRequired()
				.HasMaxLength(50);
			builder.Property(e => e.NtLogin).HasMaxLength(500);
			builder.Property(e => e.OrientationDate).HasColumnType("datetime");
			builder.Property(e => e.PagibigIdNo)
				.IsRequired()
				.HasMaxLength(50);
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
				.HasMaxLength(500);
			builder.Property(e => e.PersonalEmail)
				.IsRequired()
				.HasMaxLength(50);
			builder.Property(e => e.PhilhealthIdNo)
				.IsRequired()
				.HasMaxLength(50);
			builder.Property(e => e.Salutation)
				.IsRequired()
				.HasMaxLength(50);
			builder.Property(e => e.SssidNo)
				.IsRequired()
				.HasMaxLength(50)
				.HasColumnName("SSSIdNo");
			builder.Property(e => e.StartDate).HasColumnType("datetime");
			builder.Property(e => e.Suffix).HasMaxLength(50);
			builder.Property(e => e.TinidNo)
				.IsRequired()
				.HasMaxLength(50)
				.HasColumnName("TINIdNo");

			builder.HasOne(d => d.Candidate).WithOne(p => p.OnboardingInformationSheet)
				.HasForeignKey<OnboardingInformationSheet>(d => d.CandidateId)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_OnboardingInformationSheets_Candidates");
		}
	}
}
