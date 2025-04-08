using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Assessment.Service.API.Core.Dto.Assessment
{
    public class JwtTokenRequest
    {
        public string CandidateId { get; set; }
        public string Email { get; set; }
        public string SecretKey { get; set; }
        public string Issuer { get; set; }
        public string Audience { get; set; }

    }
}
