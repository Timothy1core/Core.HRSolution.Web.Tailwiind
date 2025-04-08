using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables
{
	public class OnboardingStatusConfig : IEntityTypeConfiguration<OnboardingStatus>
	{
		public void Configure(EntityTypeBuilder<OnboardingStatus> builder)
		{
			builder.Property(e => e.CreatedBy).HasMaxLength(50);
			builder.Property(e => e.CreatedDate).HasColumnType("datetime");
			builder.Property(e => e.StatusName)
				.IsRequired()
				.HasMaxLength(500);
		}
	}
}
