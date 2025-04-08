namespace Authentication.Models
{
	public class JwtTokenValidationRequest
	{
		
		public string Token { get; set; }
		public string SecretKey { get; set; }
		public string Issuer { get; set; }
		public string Audience { get; set; }
	}
}
