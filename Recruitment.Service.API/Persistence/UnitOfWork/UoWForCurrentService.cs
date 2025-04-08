using HRSolutionDbLibrary.Persistence.DbContexts;
using Recruitment.Service.API.Core.Repositories.CurrentService.Tables;
using Recruitment.Service.API.Core.UnitOfWork;
using Recruitment.Service.API.Persistence.Repositories.CurrentService.Tables;

namespace Recruitment.Service.API.Persistence.UnitOfWork
{
	public class UoWForCurrentService(CurrentServiceDbContext context) : IUoWForCurrentService
	{

		public IApplicationProcessRepository ApplicationProcessRepository { get; } = new ApplicationProcessRepository(context);
		public IDepartmentGroupRepository DepartmentGroupRepository { get; } = new DepartmentGroupRepository(context);
		public IDepartmentRepository DepartmentRepository { get; } = new DepartmentRepository(context);
		public ICoreServiceRepository CoreServiceRepository { get; } = new CoreServiceRepository(context);
		public IDepartmentStatusRepository DepartmentStatusRepository { get; } = new DepartmentStatusRepository(context);
		public IEmploymentTypeRepository EmploymentTypeRepository { get; } = new EmploymentTypeRepository(context);
		public IJobProfileRepository JobProfileRepository { get; } = new JobProfileRepository(context);
		public IJobStatusRepository JobStatusRepository { get; } = new JobStatusRepository(context);
		public IAssessmentRepository AssessmentRepository { get; } = new AssessmentRepository(context);
		public IJobApplicationRepository ApplicationRepository { get; } = new JobApplicationRepository(context);
		public ICandidateRepository CandidateRepository { get; } = new CandidateRepository(context);

        public ITalentAcquisitionFormBatchRepository TalentAcquisitionFormBatchRepository { get; } = new TalentAcquisitionFormBatchRepository(context);
        public ITalentAcquisitionFormRepository TalentAcquisitionFormRepository { get; } = new TalentAcquisitionFormRepository(context);
        public ITalentAcquisitionReasonRepository TalentAcquisitionReasonRepository { get; } = new TalentAcquisitionReasonRepository(context);
        public ITalentAcquisitionStatusRepository TalentAcquisitionStatusRepository { get; } = new TalentAcquisitionStatusRepository(context);
        public IWorkArrangementRepository WorkArrangementRepository { get; } = new WorkArrangementRepository(context);
        public IEmailTemplateRepository EmailTemplateRepository { get; } = new EmailTemplateRepository(context);
        public IJobOfferRepository JobOfferRepository { get; } = new JobOfferRepository(context);
		public IOnboardingRepository OnboardingRepository { get; } = new OnboardingRepository(context);
		public IWorkFromHomeInformationRepository WorkFromHomeInformationRepository { get; } = new WorkFromHomeInformationRepository(context);
		public void SaveChanges()
		{
			context.SaveChanges();
		}
		public async Task CommitAsync()
		{
			await context.SaveChangesAsync();
		}
	}
}
