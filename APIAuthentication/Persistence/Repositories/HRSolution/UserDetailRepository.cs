using APIAuthentication.Core.Dtos.Authentication;
using APIAuthentication.Core.Repositories.HRSolution;
using HRApplicationDbLibrary.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace APIAuthentication.Persistence.Repositories.HRSolution
{
	public class UserDetailRepository(HrSolutionApplicationDbContext context) : IUserDetailRepository
	{
		public async Task<UserDto> SelectLoggedUserDetails(string loggedUserId)
		{
			var userDetails = await context.UserDetails.Select(s => new UserDto()
			{
				EmoloyeeId = s.EmployeeId,
				YearHired = s.DateHired.ToString("yyyy"),
				FirstName = s.FirstName,
				LastName = s.LastName,
				EmailAddress = s.CompanyEmail,
				Gender = s.Gender
			}).FirstOrDefaultAsync(x => x.EmoloyeeId == loggedUserId);
			return userDetails!;
		}
	}
}
