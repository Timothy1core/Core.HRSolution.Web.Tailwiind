using Assessment.Service.API.Core.Repositories.CurrentService.Tables;

namespace Assessment.Service.API.Core.UnitOfWork;

public interface IUoWForCurrentService
{
    ICandidateCredentialRepository CandidateCredentialRepository { get; }
    ICandidateRepository CandidateRepository { get; }
    void SaveChanges();
    Task CommitAsync();
}