using Microsoft.AspNetCore.Authorization;

namespace Authentication
{
	public class PermissionRequirement(string permission) : IAuthorizationRequirement
	{
		public string Permission { get; } = permission;
	}
}
