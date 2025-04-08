using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;

namespace Authentication
{
	public static class JwtAuthenticationExtensions
	{
		public static IServiceCollection AddSharedJwtAuthentication(this IServiceCollection services, string authority, string audience, string secretKey)
		{
			services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
				.AddJwtBearer(options =>
				{
					options.Authority = authority;  // URL of the authorization server
					options.TokenValidationParameters = new TokenValidationParameters
					{
						ValidateIssuer = true,
						ValidIssuer = authority,
						ValidateAudience = true,
						ValidAudience = audience,
						ValidateLifetime = true,
						ClockSkew = TimeSpan.Zero, // Adjust this if necessary
						ValidateIssuerSigningKey = true,
						IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)) // Secret key for signing tokens
					};
				});
			return services;
		}



		public static IServiceCollection AddSharedJwtAuthenticationPermission(this IServiceCollection services)
		{
			
			services.AddAuthorization(options =>
			{
				// Here, you don't need to manually register individual permission policies.
				// The custom policy provider dynamically generates the policies based on your [Permission("...")] attributes.
			});

			services.AddSingleton<IAuthorizationPolicyProvider, PermissionPolicyProvider>();
			services.AddSingleton<IAuthorizationHandler, PermissionAuthorizationHandler>();
			return services;
		}
	}
}
