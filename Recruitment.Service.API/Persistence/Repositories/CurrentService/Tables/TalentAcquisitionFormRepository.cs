using HRSolutionDbLibrary.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.TalentAcquisitionForm;
using Recruitment.Service.API.Core.Repositories.CurrentService.Tables;

namespace Recruitment.Service.API.Persistence.Repositories.CurrentService.Tables
{
	public class TalentAcquisitionFormRepository(CurrentServiceDbContext context) : ITalentAcquisitionFormRepository
	{
		public async Task CreateTalentAcquisitionForm(TalentAcquisitionForm taf)
		{
			await context.TalentAcquisitionForms.AddAsync(taf);
		}

		public async Task<TalentAcquisitionForm> SelectTalentAcquisitionFormInfo(int id)
		{
			var tafInfo = await context.TalentAcquisitionForms
				.Include(i=> i.Job)
				.Include(i=> i.Status)
				.Include(i=> i.Reason)
				.Include(i=> i.WorkArrangementDetail)
				.FirstOrDefaultAsync(f=> f.Id== id);

			return tafInfo!;
		}


		public async Task<List<TalentAcquisitionFormDashboardDto>> SelectTalentAcquisitionFormDashboard(int group, int department, int status, int reason)
		{
			var tafList = await context.TalentAcquisitionForms
				.Include(i => i.Job)
				.Include(i => i.Status)
				.Include(i => i.Reason)
				.Include(i => i.WorkArrangementDetail)
				.Include(i => i.Department)
				.ToListAsync();

			tafList = group == 0 ? tafList.ToList() : tafList.Where(w => w.Department.DepartmentGroupId == group).ToList();
			tafList = department == 0 ? tafList.ToList() : tafList.Where(w => w.DepartmentId == department).ToList();
			tafList = status == 0 ? tafList.ToList() : tafList.Where(w => w.StatusId == status).ToList();
			tafList = reason == 0 ? tafList.ToList() : tafList.Where(w => w.ReasonId == reason).ToList();

			var tafListDto = tafList.Select(s => new TalentAcquisitionFormDashboardDto()
				{
					Id = s.Id,
					Position = s.Job.Position,
					Headcount = s.Headcount,
					Reason = s.Reason.Reason,
					Status = s.Status.Status,
					TargetStartDate = s.TargetStartDate.ToString("MM/dd/yyyy"),
					WorkArrangement = s.WorkArrangementDetail.Arrangement

				})
				.ToList();
			return tafListDto!;
		}

		public async Task<List<DropDownValueDto>> SelectTalentAcquisitionFormDropDown(int departmentId)
		{
			var taf = await context.TalentAcquisitionForms
				.Include(i => i.Job)
				.Where(x => x.StatusId == 1 && x.Job.DepartmentId == departmentId && x.TafBatchId==null)
				.ToListAsync();


			var dropDownValueDtos = taf.Select(s => new DropDownValueDto() 
				{
					Id = s.Id,
					Value = s.Id.ToString(),
					Label = s.Job.Position
				})
				.ToList();

			return dropDownValueDtos;

		}

		public async Task UpdateTalentAcquisitionForm(TalentAcquisitionForm taf)
		{
			var tafInfo =await context.TalentAcquisitionForms.FindAsync(taf.Id);


			if (tafInfo != null)
			{
				tafInfo.RequestDate = taf.RequestDate;
				tafInfo.StatusId = taf.StatusId;
				tafInfo.ReasonId = taf.ReasonId;
				tafInfo.DepartmentId = taf.DepartmentId;
				tafInfo.JobId = taf.JobId;
				tafInfo.Negotiable = taf.Negotiable;
				tafInfo.NonNegotiable = taf.NonNegotiable;
				tafInfo.TargetSalaryRange = taf.TargetSalaryRange;
				tafInfo.InterviewSchedule = taf.InterviewSchedule;
				tafInfo.HiringManager = taf.HiringManager;
				tafInfo.TargetStartDate = taf.TargetStartDate;
				tafInfo.WorkArrangement = taf.WorkArrangement;
				tafInfo.Schedule = taf.Schedule;
				tafInfo.Equipment = taf.Equipment;
				tafInfo.Notes = taf.Notes;
			}
		}
	}
}
