using HRSolutionDbLibrary.Core.Entities.Tables;
using HRSolutionDbLibrary.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Graph.Models.Security;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.JobOffer;
using Recruitment.Service.API.Core.Models.CurrentService.Dtos.Onboarding;
using Recruitment.Service.API.Core.Repositories.CurrentService.Tables;

namespace Recruitment.Service.API.Persistence.Repositories.CurrentService.Tables
{
	public class OnboardingRepository(CurrentServiceDbContext context) : IOnboardingRepository
	{
		public async Task SaveOnboardingInformation(OnboardingInformationSheet onboardingInformationSheet)
		{
			await context.OnboardingInformationSheets.AddAsync(onboardingInformationSheet);
		}

		public async Task<OnboardingInformationSheetDto> RetrieveOnboardingInformation(int candidateId)
		{
			var onboardingInfo = await context.OnboardingInformationSheets
				.Include(x => x.Candidate)
				.ThenInclude(i => i.Job)
				.Where(w => w.CandidateId == candidateId)
				.Select(s => new OnboardingInformationSheetDto
				{
					CandidateId = s.CandidateId,
					FirstName = s.FirstName,
					LastName = s.LastName,
					MiddleName = s.MiddleName,
					MiddleNamePrefix = s.MiddleNamePrefix,
					Suffix = s.Suffix,
					Salutation = s.Salutation,
					Gender = s.Gender,
					CivilStatus = s.CivilStatus,
					DateOfBirth = s.DateOfBirth,
					CurrentAddress = s.CurrentAddress,
					CurrentLocation = s.CurrentLocation,
					CurrentCityProvince = s.CurrentCityProvince,
					CurrentZipcode = s.CurrentZipcode,
					PermanentAddress = s.PermanentAddress,
					PermanentLocation = s.PermanentLocation,
					PermanentCityProvince = s.PermanentCityProvince,
					PermanentZipcode = s.PermanentZipcode,
					EducationalAttainment = s.EducationalAttainment,
					LandlineNo = s.LandlineNo,
					MobileNo = s.MobileNo,
					AlternativeMobileNo = s.AlternativeMobileNo,
					PersonalEmail = s.PersonalEmail,
					EmergencyContactPerson = s.EmergencyContactPerson,
					EmergencyContactNo = s.EmergencyContactNo,
					EmergencyRelation = s.EmergencyRelation,
					SssidNo = s.SssidNo,
					TinidNo = s.TinidNo,
					PhilhealthIdNo = s.PhilhealthIdNo,
					PagibigIdNo = s.PagibigIdNo,
					CurrentStep = s.CurrentStep,
					IsAcknowledged = s.IsAcknowledged,
					CandidateName = s.Candidate.FirstName + " " + s.Candidate.LastName,
					Position = s.Candidate.Job.Position,
				})
				.FirstOrDefaultAsync();
			return onboardingInfo!;
		}

		public async Task<List<OnboardingInformationSheetDashboardDto>> RetrieveCandidateOnboardingInfoList()
		{
			var candidateOnboardingInfo = await context.OnboardingInformationSheets
				.Include(x => x.Candidate)
				.ThenInclude(i => i.Job)
			//.Include(i => i.JobOfferStatus)
			.ToListAsync();

			//candidateOnboardingInfo = status == 0 ? candidateOnboardingInfo.ToList() : candidateOnboardingInfo.Where(x => x.JobOfferStatusId == status).ToList();

			var candidateOnboardingInfoDtos = candidateOnboardingInfo.Select(s => new OnboardingInformationSheetDashboardDto()
			{
				CandidateId = s.CandidateId,
				FirstName = s.FirstName,
				LastName = s.LastName,
				MiddleName = s.MiddleName,
				MiddleNamePrefix = s.MiddleNamePrefix,
				Suffix = s.Suffix,
				Salutation = s.Salutation,
				Gender = s.Gender,
				CivilStatus = s.CivilStatus,
				DateOfBirth = s.DateOfBirth,
				CurrentAddress = s.CurrentAddress,
				CurrentLocation = s.CurrentLocation,
				CurrentCityProvince = s.CurrentCityProvince,
				CurrentZipcode = s.CurrentZipcode,
				PermanentAddress = s.PermanentAddress,
				PermanentLocation = s.PermanentLocation,
				PermanentCityProvince = s.PermanentCityProvince,
				PermanentZipcode = s.PermanentZipcode,
				EducationalAttainment = s.EducationalAttainment,
				LandlineNo = s.LandlineNo,
				MobileNo = s.MobileNo,
				AlternativeMobileNo = s.AlternativeMobileNo,
				PersonalEmail = s.PersonalEmail,
				EmergencyContactPerson = s.EmergencyContactPerson,
				EmergencyContactNo = s.EmergencyContactNo,
				EmergencyRelation = s.EmergencyRelation,
				SssidNo = s.SssidNo,
				TinidNo = s.TinidNo,
				PhilhealthIdNo = s.PhilhealthIdNo,
				PagibigIdNo = s.PagibigIdNo,
				CandidateName = s.Candidate.FirstName + " " + s.Candidate.LastName,
				Position = s.Candidate.Job.Position,
			})
				.ToList();
			return candidateOnboardingInfoDtos;

		}

		public async Task UpdateOnboardingInformation(OnboardingInformationSheet onboardingInformationDto)
		{
			var onboardingInformation = await context.OnboardingInformationSheets.FirstOrDefaultAsync(x => x.CandidateId == onboardingInformationDto.CandidateId);

			if (onboardingInformation != null)
			{
				onboardingInformation.FirstName = onboardingInformationDto.FirstName;
				onboardingInformation.LastName = onboardingInformationDto.LastName;
				onboardingInformation.MiddleName = onboardingInformationDto.MiddleName;
				onboardingInformation.MiddleNamePrefix = onboardingInformationDto.MiddleNamePrefix;
				onboardingInformation.Suffix = onboardingInformationDto.Suffix;
				onboardingInformation.Salutation = onboardingInformationDto.Salutation;
				onboardingInformation.Gender = onboardingInformationDto.Gender;
				onboardingInformation.CivilStatus = onboardingInformationDto.CivilStatus;
				onboardingInformation.DateOfBirth = onboardingInformationDto.DateOfBirth;
				onboardingInformation.CurrentAddress = onboardingInformationDto.CurrentAddress;
				onboardingInformation.CurrentLocation = onboardingInformationDto.CurrentLocation;
				onboardingInformation.CurrentCityProvince = onboardingInformationDto.CurrentCityProvince;
				onboardingInformation.CurrentZipcode = onboardingInformationDto.CurrentZipcode;
				onboardingInformation.PermanentAddress = onboardingInformationDto.PermanentAddress;
				onboardingInformation.PermanentLocation = onboardingInformationDto.PermanentLocation;
				onboardingInformation.PermanentCityProvince = onboardingInformationDto.PermanentCityProvince;
				onboardingInformation.PermanentZipcode = onboardingInformationDto.PermanentZipcode;
				onboardingInformation.EducationalAttainment = onboardingInformationDto.EducationalAttainment;
				onboardingInformation.LandlineNo = onboardingInformationDto.LandlineNo;
				onboardingInformation.MobileNo = onboardingInformationDto.MobileNo;
				onboardingInformation.AlternativeMobileNo = onboardingInformationDto.AlternativeMobileNo;
				onboardingInformation.PersonalEmail = onboardingInformationDto.PersonalEmail;
				onboardingInformation.EmergencyContactPerson = onboardingInformationDto.EmergencyContactPerson;
				onboardingInformation.EmergencyContactNo = onboardingInformationDto.EmergencyContactNo;
				onboardingInformation.EmergencyRelation = onboardingInformationDto.EmergencyRelation;
				onboardingInformation.SssidNo = onboardingInformationDto.SssidNo;
				onboardingInformation.TinidNo = onboardingInformationDto.TinidNo;
				onboardingInformation.PhilhealthIdNo = onboardingInformationDto.PhilhealthIdNo;
				onboardingInformation.PagibigIdNo = onboardingInformationDto.PagibigIdNo;
				onboardingInformation.IsAcknowledged = onboardingInformationDto.IsAcknowledged;
			}
		}

		public async Task AcknowledgeOnboardingForm(int id, bool isAcknowledged)
		{
			var onboardingInformation = await context.OnboardingInformationSheets.FirstOrDefaultAsync(x => x.CandidateId == id);

			if (onboardingInformation != null)
			{
				onboardingInformation.IsAcknowledged = isAcknowledged;
			}
		}

		public async Task SaveOnboardingDocument(OnboardingDocument onboardingDocument)
		{
			await context.OnboardingDocuments.AddAsync(onboardingDocument);
		}

		public async Task<OnboardingDocumentDto> RetrieveOnboardingDocument(int candidateId, string documentType)
		{
			var onboardingDocumentInfo = await context.OnboardingDocuments
				.Include(x => x.Candidate)
				.ThenInclude(i => i.Job)
				.Where(w => w.CandidateId == candidateId && w.DocumentType == documentType)
				.Select(s => new OnboardingDocumentDto
				{
					CandidateId = s.CandidateId,
					FileName = s.FileName,
					DocumentType = s.DocumentType,
					IsSubmitted = s.IsSubmitted,
					IsHrverification = s.IsHrverification,
					DateSubmitted = s.DateSubmitted,
					DocumentGroup = s.DocumentGroup,
				})
				.FirstOrDefaultAsync();
			return onboardingDocumentInfo!;
		}

		public async Task<List<OnboardingDocumentDto>> RetrieveAllOnboardingDocuments(int candidateId, string documentType)
		{
			var onboardingDocuments = await context.OnboardingDocuments
				.Include(x => x.Candidate)
				.ThenInclude(i => i.Job)
				.Where(w => w.CandidateId == candidateId && w.DocumentType == documentType)
				.Select(s => new OnboardingDocumentDto
				{
					CandidateId = s.CandidateId,
					FileName = s.FileName,
					DocumentType = s.DocumentType,
					IsSubmitted = s.IsSubmitted,
					IsHrverification = s.IsHrverification,
					DateSubmitted = s.DateSubmitted,
					DocumentGroup = s.DocumentGroup,
				})
				.ToListAsync();

			return onboardingDocuments;
		}

		public async Task<List<OnboardingDocumentDto>> RetrieveCandidateOnboardingDocuments(int candidateId)
		{
			var candidateOnboardingDocuments = await context.OnboardingDocuments
				.Include(x => x.Candidate)
				.ThenInclude(i => i.Job)
				.Where(i => i.CandidateId == candidateId)
			.ToListAsync();

			var candidateOnboardingDocumentsDtos = candidateOnboardingDocuments.Select(s => new OnboardingDocumentDto()
			{
				CandidateId = s.CandidateId,
				FileName = s.FileName,
				DocumentType = s.DocumentType,
				IsSubmitted = s.IsSubmitted,
				IsHrverification = s.IsHrverification,
				DateSubmitted = s.DateSubmitted,
				DocumentGroup = s.DocumentGroup,
			})
				.ToList();
			return candidateOnboardingDocumentsDtos;

		}

		public async Task<CandidatePreRequisiteDocumentsResultDto> RetrieveCandidatePreRequisiteDocumentsResult(int candidateId)
		{
			var candidateOnboardingDocuments = await context.OnboardingDocuments
				.Include(x => x.Candidate)
				.ThenInclude(i => i.Job)
				.Where(i => i.CandidateId == candidateId)
				.ToListAsync();

			bool hasNbiClearance = candidateOnboardingDocuments.Any(doc => doc.DocumentType == "nbiClearance");
			bool hasBirthCertificate = candidateOnboardingDocuments.Any(doc => doc.DocumentType == "birthCertificate");
			bool hasMedicalExam = candidateOnboardingDocuments.Any(doc => doc.DocumentType == "medicalExam");

			return new CandidatePreRequisiteDocumentsResultDto
			{
				HasNbiClearance = hasNbiClearance,
				HasBirthCertificate = hasBirthCertificate,
				HasMedicalExam = hasMedicalExam
			};
		}

		public async Task<CandidateGeneralDocumentsResultDto> RetrieveCandidateGeneralDocumentsResult(int candidateId)
		{
			var candidateOnboardingDocuments = await context.OnboardingDocuments
				.Include(x => x.Candidate)
				.ThenInclude(i => i.Job)
				.Where(i => i.CandidateId == candidateId)
				.ToListAsync();

			bool hasPagibig = candidateOnboardingDocuments.Any(doc => doc.DocumentType == "pagibig");
			bool hasPhilhealth = candidateOnboardingDocuments.Any(doc => doc.DocumentType == "philhealth");
			bool hasTin = candidateOnboardingDocuments.Any(doc => doc.DocumentType == "tin");
			bool hasSss = candidateOnboardingDocuments.Any(doc => doc.DocumentType == "sss");
			bool hasDiploma = candidateOnboardingDocuments.Any(doc => doc.DocumentType == "diploma");
			bool hasMarriageCert = candidateOnboardingDocuments.Any(doc => doc.DocumentType == "marriageCert");
			bool hasDependentCert = candidateOnboardingDocuments.Any(doc => doc.DocumentType == "dependentCert");
			bool hasEmploymentCert = candidateOnboardingDocuments.Any(doc => doc.DocumentType == "employmentCert");
			bool hasForm2316 = candidateOnboardingDocuments.Any(doc => doc.DocumentType == "form2316");

			return new CandidateGeneralDocumentsResultDto
			{
				HasPagibig = hasPagibig,
				HasPhilhealth = hasPhilhealth,
				HasTin = hasTin,
				HasSss = hasSss,
				HasDiploma = hasDiploma,
				HasMarriageCert = hasMarriageCert,
				HasDependentCert = hasDependentCert,
				HasEmploymentCert = hasEmploymentCert,
				HasForm2316 = hasForm2316
			};
		}

		public async Task UpdateOnboardingStep(int candidateId, int step)
		{
			var onboardingInformation = await context.OnboardingInformationSheets.FirstOrDefaultAsync(x => x.CandidateId == candidateId);

			if (onboardingInformation != null)
			{
				onboardingInformation.CurrentStep = step;
			}
		}
	}
}
