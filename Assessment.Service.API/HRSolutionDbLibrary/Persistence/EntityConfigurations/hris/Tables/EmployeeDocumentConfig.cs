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
	public class EmployeeDocumentConfig : IEntityTypeConfiguration<EmployeeDocument>
	{
		public void Configure(EntityTypeBuilder<EmployeeDocument> builder)
		{
			builder.Property(e => e.DateSubmitted).HasColumnType("datetime");
			builder.HasOne(d => d.EmployeeInformation).WithMany(p => p.EmployeeDocument)
				.HasForeignKey(d => d.EmployeeId)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_EmployeeDocuments_EmployeeInformations");
		}
	}
}
