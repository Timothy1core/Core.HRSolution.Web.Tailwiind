using APIAuthentication.Core.Application;
using APIAuthentication.Core.Dtos.Authentication;
using APIAuthentication.Core.Helpers;
using APIAuthentication.Core.UnitOfWork;
using Authentication.Models;
using Microsoft.AspNetCore.Mvc;

namespace APIAuthentication.Persistence.Application
{
	public class UserCredentialService(
		IUoWForHrSolutionApplication uoWForHrSolutionApplication,
		ILogger<UserCredentialService> logger,
		IConfiguration configuration)
		: IUserCredentialService
	{

		private readonly IUoWForHrSolutionApplication _uoWForHrSolutionApplication = uoWForHrSolutionApplication;
		private readonly ILogger<UserCredentialService> _logger = logger;
		private readonly IConfiguration _configuration = configuration;


		public async Task<JsonResult> AuthenticateUserService(LoginRequestDto loginRequest)
		{
			JsonResult result;
			try
			{
				var user = await _uoWForHrSolutionApplication.UserCredentialRepository.AuthenticateAsync(loginRequest.Email);
				var permissions = user.Role.UserApiPermissions.Select(s => s.Api.ApiPermission).ToList();
				if (!PasswordHelper.VerifyPassword(loginRequest.Password, user.Password))
				{
					await _uoWForHrSolutionApplication.UserCredentialRepository.SetLogInAttempts(user.Id);
					await _uoWForHrSolutionApplication.CommitAsync();

					result = new JsonResult(new { success = false, responseText = "The password you entered does not match our records. Please try again." })
					{
						StatusCode = 400
					};
					return result;
				}

				if (user.IsLockOut)
				{
					result = new JsonResult(new { success = false, responseText = "Your account has been locked out due to too many failed login attempts." })
					{
						StatusCode = 400
					};
					return result;
				}


				var jwtSettings = _configuration.GetSection("JwtSettings");

				var tokenModel = new JwtTokenRequest
				{
					EmployeeId = user.EmployeeId,
					Email = user.Email,
					Role = user.Role.Role,
					Permissions = permissions,
					SecretKey = jwtSettings["Secret"]!,
					Issuer = jwtSettings["Issuer"]!,
					Audience = jwtSettings["Audience"]!
				};

				var token = Authentication.JwtTokenHelper.GenerateToken(tokenModel);
                var isCore = true;

				await _uoWForHrSolutionApplication.UserCredentialRepository.SetDefaultLogInAttempts(user.Id);
				await _uoWForHrSolutionApplication.CommitAsync();

				result = new JsonResult(new { token, isCore })
				{
					StatusCode = 200
				};
				return result;

			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while fetching Authenticate User: {e.Message}");
				result = new JsonResult(new { success = false, responseText = $"Error occurred while fetching Authenticate User: {e.Message}" })
				{
					StatusCode = 500
				};
				return result;
			}
			
		}

		public async Task<JsonResult> AuthenticateUserVerificationService(string authHeader)
		{
			JsonResult result;
			try
			{
				var token = authHeader.Substring("Bearer ".Length).Trim();
				if (authHeader.StartsWith("Bearer "))
				{
					var jwtSettings = _configuration.GetSection("JwtSettings");

					var tokenModel = new JwtTokenValidationRequest
					{
						Token = token,
						SecretKey = jwtSettings["Secret"]!,
						Issuer = jwtSettings["Issuer"]!,
						Audience = jwtSettings["Audience"]!
					};

					var validToken = Authentication.JwtTokenHelper.ValidateToken(tokenModel, out var employeeId);

					if (validToken)
					{
						var loggedUser = await _uoWForHrSolutionApplication.UserDetailRepository.SelectLoggedUserDetails(employeeId);
						result = new JsonResult(new { loggedUser })
						{
							StatusCode = 200
						};
						return result;
					}

					
				}

				result = new JsonResult(new { success = false, responseText = "No valid authorization token found" })
				{
					StatusCode = 401
				};
				return result;


			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while fetching Authenticate User: {e.Message}");
				result = new JsonResult(new { success = false, responseText = $"Error occurred while fetching Authenticate User: {e.Message}" })
				{
					StatusCode = 500
				};
				return result;
			}

		}


		public async Task<JsonResult> LeftSideBarService(string loggedEmployee)
		{
			JsonResult result;

			try
			{
				var leftSideBarMenus = await _uoWForHrSolutionApplication.UserMenuAccessRepository.UserMenus(loggedEmployee!);

				result = new JsonResult(new { leftSideBarMenus })
				{
					StatusCode = 200
				};
				return result;
			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while fetching User Menus: {e.Message}");
				result = new JsonResult(new { success = false, responseText = $"Error occurred while fetching User Menus: {e.Message}" })
				{
					StatusCode = 500
				};
				return result;
			}
			
		}

		public async Task<JsonResult> UserMenuRoutes(string loggedEmployee)
		{
			JsonResult result;

			try
			{
				var routes = await _uoWForHrSolutionApplication.UserMenuAccessRepository.UserMenuPaths(loggedEmployee!);

				result = new JsonResult(new { routes })
				{
					StatusCode = 200
				};
				return result;
			}
			catch (Exception e)
			{
				_logger.LogError($"Error occurred while fetching Routes: {e.Message}");
				result = new JsonResult(new { success = false, responseText = $"Error occurred while fetching Routes: {e.Message}" })
				{
					StatusCode = 500
				};
				return result;
			}

		}
	}
}
