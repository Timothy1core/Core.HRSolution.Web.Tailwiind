using HRSolutionDbLibrary.Core.Entities.Tables;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables;

public class CandidateCommentConfig : IEntityTypeConfiguration<CandidateComment>
{
    public void Configure(EntityTypeBuilder<CandidateComment> builder)
    {
		builder.Property(e => e.Comment).IsRequired();
		builder.Property(e => e.CreatedBy)
			.IsRequired()
			.HasMaxLength(50);
		builder.Property(e => e.CreatedDate).HasColumnType("datetime");

		builder.HasOne(d => d.Candidate).WithMany(p => p.CandidateComments)
			.HasForeignKey(d => d.CandidateId)
			.HasConstraintName("FK_CandidateComments_Candidates_Id");
		builder.HasOne(e => e.CreatedByInfo)
	        .WithMany()
	        .HasForeignKey(e => e.CreatedBy)
	        .HasPrincipalKey(x => x.EmployeeId);
	}
}