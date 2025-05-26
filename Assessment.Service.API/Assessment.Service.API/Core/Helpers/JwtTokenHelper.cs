using Assessment.Service.API.Core.Dto.Assessment;
using Authentication.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using JwtTokenRequest = Assessment.Service.API.Core.Dto.Assessment.JwtTokenRequest;

namespace Assessment.Service.API.Core.Helpers
{
    public static class JwtTokenHelper
    {
        public static string GenerateToken(JwtTokenRequest model)
        {

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(model.SecretKey);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.NameIdentifier, model.CandidateId),
                    new Claim(ClaimTypes.Name, model.Email),
                }),
                Expires = DateTime.UtcNow.AddHours(8),
                Issuer = model.Issuer,
                Audience = model.Audience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public static bool ValidateToken(JwtTokenValidationRequest jwt, out string nameIdentifier)
        {
            nameIdentifier = null; // Initialize the output parameter

            if (string.IsNullOrEmpty(jwt.Token)) return false;

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(jwt.SecretKey);

            try
            {
                // Set the validation parameters
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,        // Validate Issuer (optional)
                    ValidIssuer = jwt.Issuer,  // Should match the Issuer in the token
                    ValidateAudience = true,      // Validate Audience (optional)
                    ValidAudience = jwt.Audience,  // Should match the Audience in the token
                    ValidateLifetime = true,      // Validate token expiry
                    ClockSkew = TimeSpan.Zero     // Optional: Remove delay in expiration time
                };

                // Validate the token
                var principal = tokenHandler.ValidateToken(jwt.Token, validationParameters, out SecurityToken validatedToken);

                // Check if the validatedToken is indeed a JWT token
                if (validatedToken is JwtSecurityToken jwtToken)
                {
                    // Retrieve the NameIdentifier claim (usually represents user ID)
                    var nameIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier);

                    if (nameIdClaim != null)
                    {
                        nameIdentifier = nameIdClaim.Value; // Set the extracted NameIdentifier
                        return true; // Token is valid, and NameIdentifier is retrieved
                    }
                }
            }
            catch (SecurityTokenException)
            {
                // Token validation failed
                return false;
            }
            catch (Exception)
            {
                // Some other exception occurred
                return false;
            }

            return false; // Return false if token validation fails or NameIdentifier is not found
        }
    }
}
