using HRSolutionDbLibrary.Core.Entities.Tables;
using Microsoft.EntityFrameworkCore;

namespace HRSolutionDbLibrary.Core.DbContexts;

public interface ICurrentServiceDbContext
{
	DbSet<ApplicationProcess> ApplicationProcesses { get; set; }

	DbSet<Candidate> Candidates { get; set; }
	DbSet<CandidateWriteUp> CandidateWriteUps { get; set; }

	DbSet<Department> Departments { get; set; }

	DbSet<DepartmentIndividual> DepartmentIndividuals { get; set; }

	DbSet<DepartmentStatus> DepartmentStatuses { get; set; }

	DbSet<CoreService> CoreServices { get; set; }

	DbSet<EmploymentType> EmploymentTypes { get; set; }

	DbSet<JobApplicationAnswer> JobApplicationAnswers { get; set; }

	DbSet<JobApplicationChoice> JobApplicationChoices { get; set; }

	DbSet<JobApplicationProcess> JobApplicationProcesses { get; set; }

	DbSet<JobApplicationQuestion> JobApplicationQuestions { get; set; }
	DbSet<JobAssessment> JobAssessments { get; set; }
	DbSet<JobProfile> JobProfiles { get; set; }

	DbSet<JobStatus> JobStatuses { get; set; }

	DbSet<Source> Sources { get; set; }
	DbSet<TalentAcquisitionFormBatch> TalentAcquisitionFormBatches { get; set; }
	DbSet<TalentAcquisitionForm> TalentAcquisitionForms { get; set; }

	DbSet<TalentAcquisitionReason> TalentAcquisitionReasons { get; set; }

	DbSet<TalentAcquisitionStatus> TalentAcquisitionStatuses { get; set; }

	DbSet<WorkArrangement> WorkArrangements { get; set; }

	DbSet<CandidateAnswer> CandidateAnswers { get; set; }

	DbSet<Assessment> Assessments { get; set; }

	DbSet<AssessmentChoice> AssessmentChoices { get; set; }

	DbSet<AssessmentQuestion> AssessmentQuestions { get; set; }

	DbSet<AssessmentQuestionType> AssessmentQuestionTypes { get; set; }

	DbSet<AssessmentVideoDuration> AssessmentVideoDurations { get; set; }

	DbSet<CandidateCredential> CandidateCredentials { get; set; }

	DbSet<AssessmentAnswer> AssessmentAnswers { get; set; }
	DbSet<AssessmentRemainingTimer> AssessmentRemainingTimers { get; set; }
	DbSet<CandidateSnapshot> CandidateSnapshots { get; set; }
	DbSet<CandidateComment> CandidateComments { get; set; }
	DbSet<CandidateHistory> CandidateHistories { get; set; }
    DbSet<AssessmentCorrection> AssessmentCorrections { get; set; }

    DbSet<DepartmentGroup> DepartmentGroups { get; set; }
   DbSet<EmailAction> EmailActions { get; set; }
   DbSet<EmailAutomation> EmailAutomations { get; set; }
   DbSet<EmailTemplate> EmailTemplates { get; set; }
   DbSet<EmployeeInformation> EmployeeInformations { get; set; }
   DbSet<JobOfferInformation> JobOfferInformations { get; set; }
   DbSet<JobOfferStatus> JobOfferStatuses { get; set; }
	DbSet<OnboardingDocument> OnboardingDocuments { get; set; }
	DbSet<OnboardingInformationSheet> OnboardingInformationSheets { get; set; }
	DbSet<WorkFromHomeInformation> WorkFromHomeInformations { get; set; }
	DbSet<OnboardingStatus> OnboardingStatuses { get; set; }
}