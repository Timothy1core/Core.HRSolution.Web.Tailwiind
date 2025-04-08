using Microsoft.AspNetCore.Authorization;

namespace Authentication
{
	public class PermissionAuthorizationHandler : AuthorizationHandler<PermissionRequirement>
	{
		protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, PermissionRequirement requirement)
		{
			if (!context.User.HasClaim(c => c.Type == "permissions")) return Task.CompletedTask;
			{
				var permissionsClaim = context.User.FindFirst(c => c.Type == "permissions").Value;
				var userPermissions = permissionsClaim.Split(',');

				if (userPermissions.Contains(requirement.Permission))
				{
					context.Succeed(requirement);
				}
			}

			return Task.CompletedTask;
		}
	}
}
