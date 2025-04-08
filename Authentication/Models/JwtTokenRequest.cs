namespace Authentication.Models
{
	public class JwtTokenRequest
	{
		public string EmployeeId { get; set; }
		public string Email { get; set; }
		public string Role { get; set; }
		public List<string> Permissions { get; set; }
		public string SecretKey { get; set; }
		public string Issuer { get; set; }
		public string Audience { get; set; }
		
	}
}
