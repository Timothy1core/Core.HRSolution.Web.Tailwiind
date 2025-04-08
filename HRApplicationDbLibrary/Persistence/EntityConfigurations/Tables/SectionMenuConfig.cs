using HRApplicationDbLibrary.Core.Entities.Tables;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRApplicationDbLibrary.Persistence.EntityConfigurations.Tables
{
	public class SectionMenuConfig : IEntityTypeConfiguration<SectionMenu>
	{
		public void Configure(EntityTypeBuilder<SectionMenu> builder)
		{
			builder.HasKey(e => e.Id).HasName("PK_ParentMenus");

			builder.Property(e => e.CreatedBy)
				.IsRequired()
				.HasMaxLength(50);
			builder.Property(e => e.CreatedDate).HasColumnType("datetime");
			builder.Property(e => e.IsActive)
				.IsRequired()
				.HasDefaultValueSql("((1))");
			builder.Property(e => e.SectionName)
				.IsRequired()
				.HasMaxLength(500);
		}
	}
}
