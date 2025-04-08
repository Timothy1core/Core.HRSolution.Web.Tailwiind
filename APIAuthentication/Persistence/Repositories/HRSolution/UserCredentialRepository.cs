using APIAuthentication.Core.Repositories.HRSolution;
using HRApplicationDbLibrary.Core.Entities.Tables;
using HRApplicationDbLibrary.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace APIAuthentication.Persistence.Repositories.HRSolution
{
	public class UserCredentialRepository(HrSolutionApplicationDbContext context) : IUserCredentialRepository
	{
		public async Task<UserCredential> AuthenticateAsync(string email)
		{

			try
			{
				var user = await context.UserCredentials
					.Include(i => i.Role)
					.ThenInclude(t=> t.UserApiPermissions)
					.ThenInclude(i=> i.Api)
					.FirstOrDefaultAsync(x=> x.IsActive && x.Email==email);

				return user!;
			}
			catch (Exception e)
			{
				Console.WriteLine(e);
				throw;
			}

		}

		public async Task SetDefaultLogInAttempts(int id)
		{
			try
			{
				var user = await context.UserCredentials.FindAsync(id);

				if (user != null) user.LogInAttempt = 0;
			}
			catch (Exception e)
			{
				Console.WriteLine(e);
				throw;
			}
		}
		public async Task SetLogInAttempts(int id)
		{
			try
			{
				var user = await context.UserCredentials.FindAsync(id);

				if (user != null) user.LogInAttempt += 1;
			}
			catch (Exception e)
			{
				Console.WriteLine(e);
				throw;
			}
		}


	}
}
