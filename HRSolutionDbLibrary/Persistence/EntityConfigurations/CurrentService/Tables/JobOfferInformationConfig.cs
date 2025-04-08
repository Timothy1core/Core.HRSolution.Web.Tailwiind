
using HRSolutionDbLibrary.Core.Entities.Tables;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables
{
	public class JobOfferInformationConfig : IEntityTypeConfiguration<JobOfferInformation>
	{
		public void Configure(EntityTypeBuilder<JobOfferInformation> builder)
		{
			builder.HasKey(e => e.CandidateId);
			builder.Property(e => e.CandidateId).ValueGeneratedNever();
			builder.Property(e => e.AcceptedDate).HasColumnType("datetime");
			builder.Property(e => e.ApprovedDate).HasColumnType("datetime");
			builder.Property(e => e.ApproverId).HasMaxLength(50);
			builder.Property(e => e.ProbitionaryDeminimis).IsRequired();
			builder.Property(e => e.ProbitionarySalary).IsRequired();
			builder.Property(e => e.RegularDeminimis).IsRequired();
			builder.Property(e => e.RegularSalary).IsRequired();
			builder.Property(e => e.TargetStartDate).HasColumnType("datetime");

			builder.HasOne(d => d.Candidate).WithOne(p => p.JobOfferInformation)
				.HasForeignKey<JobOfferInformation>(d => d.CandidateId)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_JobOfferInformations_Candidates");

			builder.HasOne(d => d.JobOfferStatus).WithMany(p => p.JobOfferInformations)
				.HasForeignKey(d => d.JobOfferStatusId)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_JobOfferInformations_JobOfferStatus");
		}
	}
}