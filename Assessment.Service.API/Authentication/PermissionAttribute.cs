using Microsoft.AspNetCore.Authorization;

namespace Authentication
{
	public class PermissionAttribute : AuthorizeAttribute
	{
		public PermissionAttribute(string permission)
		{
			Policy = $"Permission:{permission}";
		}
	}
}
