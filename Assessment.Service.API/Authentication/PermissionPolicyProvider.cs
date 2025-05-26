using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;

namespace Authentication
{
	public class PermissionPolicyProvider(IOptions<AuthorizationOptions> options) : IAuthorizationPolicyProvider
	{
		const string POLICY_PREFIX = "Permission";
		private readonly DefaultAuthorizationPolicyProvider _fallbackPolicyProvider = new(options);

		public Task<AuthorizationPolicy?> GetPolicyAsync(string policyName)
		{
			if (!policyName.StartsWith(POLICY_PREFIX, StringComparison.OrdinalIgnoreCase))
				return _fallbackPolicyProvider.GetPolicyAsync(policyName);
			var permission = policyName.Substring(POLICY_PREFIX.Length + 1); // Remove "Permission:"
			var policy = new AuthorizationPolicyBuilder()
				.AddRequirements(new PermissionRequirement(permission))
				.Build();

			return Task.FromResult<AuthorizationPolicy?>(policy);

		}

		public Task<AuthorizationPolicy> GetDefaultPolicyAsync() => _fallbackPolicyProvider.GetDefaultPolicyAsync();

		public Task<AuthorizationPolicy?> GetFallbackPolicyAsync() => _fallbackPolicyProvider.GetFallbackPolicyAsync();
	}
}
