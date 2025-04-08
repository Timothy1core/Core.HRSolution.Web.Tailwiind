using APIAuthentication.Core.Application;
using APIAuthentication.Core.Dtos.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace APIAuthentication.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AuthController (
		IUserCredentialService userCredentialService
	) : ControllerBase
	{
		private readonly IUserCredentialService _userCredentialService = userCredentialService;

		[AllowAnonymous]
		[HttpGet("test")]
		public async Task<IActionResult> Test()
		{


			return Ok("hello word");

		}

		[AllowAnonymous]
		[HttpPost("login")]
		public async Task<IActionResult> Login([FromBody] LoginRequestDto loginRequest )
		{

			var user = await _userCredentialService.AuthenticateUserService(loginRequest);
			return user;

		}

		[Authorize]
		[HttpGet("verify_token")]
		public async Task<IActionResult> VerifyToken()
		{
			var authHeader = Request.Headers["Authorization"].FirstOrDefault();

			if (authHeader == null) return Unauthorized();

			var userLogged = await _userCredentialService.AuthenticateUserVerificationService(authHeader);
			return userLogged;

		}


		[Authorize]
		[HttpGet("user_menus")]
		public async Task<IActionResult> UsersMenus()
		{
			try
			{
				var loggedEmployee = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

				var menus = await _userCredentialService.LeftSideBarService(loggedEmployee);

				return menus;
			}
			catch (Exception e)
			{
				Console.WriteLine(e);
				throw;
			}
			
		}

		[Authorize]
		[HttpGet("user_menu_paths")]
		public async Task<IActionResult> UserMenuPaths()
		{
			try
			{
				var loggedEmployee = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

				var routes = await _userCredentialService.UserMenuRoutes(loggedEmployee);

				return routes;
			}
			catch (Exception e)
			{
				Console.WriteLine(e);
				throw;
			}

		}
	}
}
