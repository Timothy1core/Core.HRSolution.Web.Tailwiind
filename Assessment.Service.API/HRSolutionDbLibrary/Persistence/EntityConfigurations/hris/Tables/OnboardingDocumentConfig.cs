using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HRSolutionDbLibrary.Core.Entities.hris.Tables;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables
{
	class OnboardingDocumentConfig : IEntityTypeConfiguration<OnboardingDocument>
	{
		public void Configure(EntityTypeBuilder<OnboardingDocument> builder)
		{
            builder.Property(e => e.DateSubmitted).HasColumnType("datetime");
            builder.Property(e => e.IsHrverification).HasColumnName("IsHRVerification");
			builder.HasOne(d => d.Candidate).WithMany(p => p.OnboardingDocument)
				.HasForeignKey(d => d.CandidateId)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_OnboardingDocuments_Candidates");
		}
	}
}
