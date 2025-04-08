using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables
{
	public class CandidateWriteUpConfig : IEntityTypeConfiguration<CandidateWriteUp>
	{
		public void Configure(EntityTypeBuilder<CandidateWriteUp> builder)
		{
			builder.Property(e => e.CreatedBy)
				.IsRequired()
				.HasMaxLength(50);
			builder.Property(e => e.CreatedDate).HasColumnType("datetime");
			builder.Property(e => e.IsActive).HasDefaultValue(true);
			builder.Property(e => e.ProfileOverview).IsRequired();

			builder.HasOne(d => d.Candidate).WithMany(p => p.CandidateWriteUps)
				.HasForeignKey(d => d.CandidateId)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_CandidateWriteUps_Candidates");
		}
	}
}
