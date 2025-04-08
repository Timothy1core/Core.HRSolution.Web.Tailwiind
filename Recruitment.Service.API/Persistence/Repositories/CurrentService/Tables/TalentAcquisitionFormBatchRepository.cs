using System.Diagnostics.Contracts;
using HRSolutionDbLibrary.Core.Entities.Tables;
using HRSolutionDbLibrary.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.TalentAcquisitionForm;
using Recruitment.Service.API.Core.Repositories.CurrentService.Tables;

namespace Recruitment.Service.API.Persistence.Repositories.CurrentService.Tables
{
	public class TalentAcquisitionFormBatchRepository(CurrentServiceDbContext context) : ITalentAcquisitionFormBatchRepository
	{
		public async Task CreateTalentAcquisitionFormBatch(TalentAcquisitionFormBatch batch, List<int> tafId)
		{
			await context.TalentAcquisitionFormBatches.AddAsync(batch);

			await context.SaveChangesAsync();

			var taf = context.TalentAcquisitionForms.Where(x => tafId.Contains(x.Id)).ToList();

			foreach (var t in taf)
			{
				t.TafBatchId = batch.Id;
			}

		}

		public async Task<TalentAcquisitionFormBatch> SelectTalentAcquisitionFormBatchInfo(int id)
		{
			var info =await context.TalentAcquisitionFormBatches
				.Include(i => i.TalentAcquisitionForms)
				.ThenInclude(t => t.Job)
				.Include(i => i.TalentAcquisitionForms)
				.ThenInclude(t => t.Reason) // Additional navigation property
				.Include(i => i.TalentAcquisitionForms)
				.ThenInclude(t => t.Status) // Additional navigation property
				.Include(i => i.TalentAcquisitionForms)
				.ThenInclude(t => t.WorkArrangementDetail) // Additional navigation property
				.Include(i => i.ApproverDetail)
				.ThenInclude(a => a.Department)
				.FirstOrDefaultAsync(x => x.Id==id);

			return info;
		}

		public async Task SaveAcknowledgement(TalentAcquisitionClientAcknowledgmentDto acknowledgmentDto)
		{
			var taf = await context.TalentAcquisitionFormBatches
				.Include(talentAcquisitionFormBatch => talentAcquisitionFormBatch.TalentAcquisitionForms)
				.FirstOrDefaultAsync(x => x.Id == acknowledgmentDto.Id);

			if (taf != null)
			{
				taf.Signature = acknowledgmentDto.Signature;
				taf.ApprovalDate = acknowledgmentDto.ApprovedDate;
				taf.ApprovalIp = acknowledgmentDto.IpAddress;
				taf.IsApproved = true;

				await context.TalentAcquisitionForms
					.Where(f => f.TafBatchId == taf.Id)
					.ExecuteUpdateAsync(e => e
						.SetProperty(u => u.StatusId, 2)
					);
			}
		}
	}
}
