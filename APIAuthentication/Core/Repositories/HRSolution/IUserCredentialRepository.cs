using HRApplicationDbLibrary.Core.Entities.Tables;

namespace APIAuthentication.Core.Repositories.HRSolution;

public interface IUserCredentialRepository
{
	Task<UserCredential> AuthenticateAsync(string email);
	Task SetDefaultLogInAttempts(int id);
	Task SetLogInAttempts(int id); 
}