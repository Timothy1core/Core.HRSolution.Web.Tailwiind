using HRSolutionDbLibrary.Core.DbContexts;
using HRSolutionDbLibrary.Core.Entities.Tables;
using HRSolutionDbLibrary.Persistence.EntityConfigurations.CurrentService.Tables;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace HRSolutionDbLibrary.Persistence.DbContexts
{
	public class CurrentServiceDbContext(DbContextOptions<CurrentServiceDbContext> options) : DbContext(options), ICurrentServiceDbContext
	{
		public DbSet<ApplicationProcess> ApplicationProcesses { get; set; }

		public DbSet<Candidate> Candidates { get; set; }

		public DbSet<CandidateWriteUp> CandidateWriteUps { get; set; }

		public DbSet<DepartmentIndividual> DepartmentIndividuals { get; set; }
		public DbSet<DepartmentStatus> DepartmentStatuses { get; set; }


		public DbSet<CoreService> CoreServices { get; set; }

		public DbSet<EmploymentType> EmploymentTypes { get; set; }

		public DbSet<JobApplicationAnswer> JobApplicationAnswers { get; set; }

		public DbSet<JobApplicationChoice> JobApplicationChoices { get; set; }

		public DbSet<JobApplicationProcess> JobApplicationProcesses { get; set; }

		public DbSet<JobApplicationQuestion> JobApplicationQuestions { get; set; }

		public DbSet<JobAssessment> JobAssessments { get; set; }
		public DbSet<JobProfile> JobProfiles { get; set; }

		public DbSet<JobStatus> JobStatuses { get; set; }

		public DbSet<Source> Sources { get; set; }

		public DbSet<TalentAcquisitionFormBatch> TalentAcquisitionFormBatches { get; set; }
		public DbSet<TalentAcquisitionForm> TalentAcquisitionForms { get; set; }

		public DbSet<TalentAcquisitionReason> TalentAcquisitionReasons { get; set; }

		public DbSet<TalentAcquisitionStatus> TalentAcquisitionStatuses { get; set; }

		public DbSet<WorkArrangement> WorkArrangements { get; set; }

		public DbSet<CandidateAnswer> CandidateAnswers { get; set; }

		public DbSet<Assessment> Assessments { get; set; }

		public DbSet<AssessmentChoice> AssessmentChoices { get; set; }

		public DbSet<AssessmentQuestion> AssessmentQuestions { get; set; }

		public DbSet<AssessmentQuestionType> AssessmentQuestionTypes { get; set; }

		public DbSet<AssessmentVideoDuration> AssessmentVideoDurations { get; set; }

		public DbSet<Department> Departments { get; set; }
		public DbSet<AssessmentAnswer> AssessmentAnswers { get; set; }

        public DbSet<CandidateCredential> CandidateCredentials { get; set; }

        public DbSet<AssessmentRemainingTimer> AssessmentRemainingTimers { get; set; }

		public DbSet<CandidateSnapshot> CandidateSnapshots { get; set; }
        public DbSet<CandidateHistory> CandidateHistories { get; set; }
        public DbSet<CandidateComment> CandidateComments { get; set; }
        public DbSet<AssessmentCorrection> AssessmentCorrections { get; set; }
        public DbSet<DepartmentGroup> DepartmentGroups { get; set; }
        public DbSet<EmailAction> EmailActions { get; set; }
        public DbSet<EmailAutomation> EmailAutomations { get; set; }
        public DbSet<EmailTemplate> EmailTemplates { get; set; }

        public DbSet<EmployeeInformation> EmployeeInformations { get; set; }

        public DbSet<JobOfferInformation> JobOfferInformations { get; set; }
        public DbSet<JobOfferStatus> JobOfferStatuses { get; set; }
		public DbSet<OnboardingDocument> OnboardingDocuments { get; set; }
		public DbSet<OnboardingInformationSheet> OnboardingInformationSheets { get; set; }
		public DbSet<WorkFromHomeInformation> WorkFromHomeInformations { get; set; }
		public DbSet<OnboardingStatus> OnboardingStatuses { get; set; }
		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			modelBuilder.ApplyConfiguration(new ApplicationProcessConfig());
			modelBuilder.ApplyConfiguration(new CandidateConfig());
            modelBuilder.ApplyConfiguration(new CandidateCredentialConfig());
            modelBuilder.ApplyConfiguration(new CandidateWriteUpConfig());
			modelBuilder.ApplyConfiguration(new DepartmentConfig());
			modelBuilder.ApplyConfiguration(new DepartmentIndividualConfig());
			modelBuilder.ApplyConfiguration(new DepartmentStatusConfig());
			modelBuilder.ApplyConfiguration(new CoreServiceConfig());
			modelBuilder.ApplyConfiguration(new EmploymentTypeConfig());
			modelBuilder.ApplyConfiguration(new JobApplicationAnswerConfig());
			modelBuilder.ApplyConfiguration(new JobApplicationChoiceConfig());
			modelBuilder.ApplyConfiguration(new JobApplicationProcessConfig());
			modelBuilder.ApplyConfiguration(new JobApplicationQuestionConfig());
			modelBuilder.ApplyConfiguration(new JobAssessmentConfig());
			modelBuilder.ApplyConfiguration(new JobProfileConfig());
			modelBuilder.ApplyConfiguration(new JobStatusConfig());
			modelBuilder.ApplyConfiguration(new SourceConfig());
			modelBuilder.ApplyConfiguration(new TalentAcquisitionFormBatchConfig());
			modelBuilder.ApplyConfiguration(new TalentAcquisitionFormConfig());
			modelBuilder.ApplyConfiguration(new TalentAcquisitionReasonConfig());
			modelBuilder.ApplyConfiguration(new TalentAcquisitionStatusConfig());
			modelBuilder.ApplyConfiguration(new WorkArrangementConfig());
			modelBuilder.ApplyConfiguration(new AssessmentAnswerConfig());
			modelBuilder.ApplyConfiguration(new AssessmentConfig());
			modelBuilder.ApplyConfiguration(new AssessmentChoiceConfig());
			modelBuilder.ApplyConfiguration(new AssessmentQuestionConfig());
			modelBuilder.ApplyConfiguration(new AssessmentQuestionTypeConfig());
			modelBuilder.ApplyConfiguration(new AssessmentVideoDurationConfig());
            modelBuilder.ApplyConfiguration(new CandidateAnswerConfig());
            modelBuilder.ApplyConfiguration(new AssessmentRemainingTimerConfig());
            modelBuilder.ApplyConfiguration(new CandidateSnapshotConfig());
            modelBuilder.ApplyConfiguration(new CandidateCommentConfig());
            modelBuilder.ApplyConfiguration(new CandidateHistoryConfig());
            modelBuilder.ApplyConfiguration(new AssessmentCorrectionConfig());
            modelBuilder.ApplyConfiguration(new DepartmentGroupConfig());
            modelBuilder.ApplyConfiguration(new EmailActionConfig());
            modelBuilder.ApplyConfiguration(new EmailAutomationConfig());
            modelBuilder.ApplyConfiguration(new EmailTemplateConfig());
            modelBuilder.ApplyConfiguration(new EmployeeInformationConfig());
            modelBuilder.ApplyConfiguration(new JobOfferInformationConfig());
            modelBuilder.ApplyConfiguration(new JobOfferStatusConfig());
			modelBuilder.ApplyConfiguration(new OnboardingDocumentConfig());
			modelBuilder.ApplyConfiguration(new OnboardingInformationSheetConfig());
			modelBuilder.ApplyConfiguration(new WorkFromHomeInformationConfig());
			modelBuilder.ApplyConfiguration(new OnboardingStatusConfig());
			base.OnModelCreating(modelBuilder);
		}
	}
}
