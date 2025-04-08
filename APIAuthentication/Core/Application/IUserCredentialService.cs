using APIAuthentication.Core.Dtos.Authentication;
using Microsoft.AspNetCore.Mvc;

namespace APIAuthentication.Core.Application;

public interface IUserCredentialService
{
	Task<JsonResult> AuthenticateUserService(LoginRequestDto loginRequest);
	Task<JsonResult> AuthenticateUserVerificationService(string authHeader);
	Task<JsonResult> LeftSideBarService(string loggedEmployee);

	Task<JsonResult> UserMenuRoutes(string loggedEmployee);
}