using APIAuthentication.Core.Dtos.Authentication;

namespace APIAuthentication.Core.Repositories.HRSolution;

public interface IUserDetailRepository
{
	Task<UserDto> SelectLoggedUserDetails(string loggedUserId);
}