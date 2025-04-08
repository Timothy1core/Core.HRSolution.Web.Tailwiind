using Assessment.Service.API.Core.Repositories.CurrentService.Tables;
using Assessment.Service.API.Core.UnitOfWork;
using Assessment.Service.API.Persistence.EntityConfigurations.CurrentService.Tables;
using HRSolutionDbLibrary.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore.Infrastructure.Internal;

namespace Assessment.Service.API.Persistence.UnitOfWork
{
    public class UoWForCurrentService (CurrentServiceDbContext context) : IUoWForCurrentService
    {
        private readonly CurrentServiceDbContext _context = context;

        public ICandidateRepository CandidateRepository { get; } = new CandidateRepository(context);
        public ICandidateCredentialRepository CandidateCredentialRepository { get; } = new CandidateCredentialRepository(context);

        public void SaveChanges()
        {
            _context.SaveChanges();
        }
        public async Task CommitAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}

