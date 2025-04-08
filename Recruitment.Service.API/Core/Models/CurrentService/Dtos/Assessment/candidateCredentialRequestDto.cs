namespace Recruitment.Service.API.Core.Models.CurrentService.Dtos.Assessment;

public class candidateCredentialRequestDto
{
    public int candidateId { get; set; }
    public DateTime Expiration { get; set; }
}