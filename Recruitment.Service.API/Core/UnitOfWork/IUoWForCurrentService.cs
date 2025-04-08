using Recruitment.Service.API.Core.Repositories.CurrentService.Tables;
using Recruitment.Service.API.Persistence.Repositories.CurrentService.Tables;

namespace Recruitment.Service.API.Core.UnitOfWork;

public interface IUoWForCurrentService
{

	IApplicationProcessRepository ApplicationProcessRepository { get; }
	IDepartmentGroupRepository DepartmentGroupRepository { get; }
	IDepartmentRepository DepartmentRepository { get; }
	ICoreServiceRepository CoreServiceRepository { get; }
	IDepartmentStatusRepository DepartmentStatusRepository { get; }
	IEmploymentTypeRepository EmploymentTypeRepository { get; }
	IJobProfileRepository JobProfileRepository { get; }
	IJobStatusRepository JobStatusRepository { get; }
	IAssessmentRepository AssessmentRepository { get; }
	IJobApplicationRepository ApplicationRepository { get; }
	ICandidateRepository CandidateRepository { get; }
	ITalentAcquisitionFormBatchRepository TalentAcquisitionFormBatchRepository { get; }
	ITalentAcquisitionFormRepository TalentAcquisitionFormRepository { get; }
	ITalentAcquisitionReasonRepository TalentAcquisitionReasonRepository { get; }
	ITalentAcquisitionStatusRepository TalentAcquisitionStatusRepository { get; }
	IWorkArrangementRepository WorkArrangementRepository { get; } 
	IEmailTemplateRepository EmailTemplateRepository { get; }
	IJobOfferRepository JobOfferRepository { get; }
	IOnboardingRepository OnboardingRepository { get; }
	IWorkFromHomeInformationRepository WorkFromHomeInformationRepository { get; }
	void SaveChanges();
	Task CommitAsync();

}