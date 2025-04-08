using HRSolutionDbLibrary.Core.Entities.Tables;

namespace Recruitment.Service.API.Core.Helpers;

public interface ITalentAcquisitionFormHelper
{
	Task CreateDocumentSigned(TalentAcquisitionFormBatch taf);
	Task SendEmailForAcknowledgement(TalentAcquisitionFormBatch taf);
	Task SendEmailForSignedDocument(TalentAcquisitionFormBatch taf);
}