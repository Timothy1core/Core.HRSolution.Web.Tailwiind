using Assessment.Service.API.Core.Applications;
using Assessment.Service.API.Core.Dto.Assessment;
using Assessment.Service.API.Core.Dto.NewFolder;
using Assessment.Service.API.Core.Helpers;
using Assessment.Service.API.Core.UnitOfWork;
using Authentication.Models;
using HRSolutionDbLibrary.Core.Entities.Tables;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Security.Cryptography.X509Certificates;
using FileServiceLibrary;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using JwtTokenRequest = Assessment.Service.API.Core.Dto.Assessment.JwtTokenRequest;
using JwtTokenValidationRequest = Authentication.Models.JwtTokenValidationRequest;

namespace Assessment.Service.API.Persistence.Applications
{
    public class AssessmentServices(
        IUoWForCurrentService uoWForCurrentService,
        ILogger<AssessmentServices> logger,
        IWebHostEnvironment webHostEnvironment,
        IConfiguration configuration,
        IFileService fileService

    ) : IAssessmentServices
    {
        private readonly IUoWForCurrentService _uoWForCurrentService = uoWForCurrentService;
        private readonly ILogger<AssessmentServices> _logger = logger;
        private readonly IConfiguration _configuration = configuration;
        private readonly IFileService _fileService = fileService;
        private readonly string? _fileRootFolder = webHostEnvironment.IsDevelopment() ? webHostEnvironment.ContentRootPath : configuration.GetSection("baseFileLocation").Value;

        public async Task<JsonResult> AuthenticateCandidateService(LoginRequestDto loginRequest)
        {
            JsonResult result;
            try
            {
                var candidate = await _uoWForCurrentService.CandidateCredentialRepository.AuthenticateAsync(loginRequest.Email);
                if (loginRequest.Password != candidate.Password)
                {
                    await _uoWForCurrentService.CandidateCredentialRepository.SetLogInAttempts(candidate.Id);
                    await _uoWForCurrentService.CommitAsync();

                    result = new JsonResult(new { success = false, responseText = "The password you entered does not match our records. Please try again." })
                    {
                        StatusCode = 400
                    };
                    return result;
                }

                if (candidate.IsLockOut)
                {
                    result = new JsonResult(new { success = false, responseText = "Your account has been locked out due to too many failed login attempts." })
                    {
                        StatusCode = 400
                    };
                    return result;
                }


                var jwtSettings = _configuration.GetSection("JwtSettings");

                var tokenModel = new JwtTokenRequest
                {
                    CandidateId = candidate.CandidateStringId,
                    Email = candidate.Email,
                    SecretKey = jwtSettings["Secret"]!,
                    Issuer = jwtSettings["Issuer"]!,
                    Audience = jwtSettings["Audience"]!
                };

                var token = JwtTokenHelper.GenerateToken(tokenModel);
                var isCore = false;

                await _uoWForCurrentService.CandidateCredentialRepository.SetDefaultLogInAttempts(candidate.Id);
                await _uoWForCurrentService.CommitAsync();

                result = new JsonResult(new { token, isCore })
                {
                    StatusCode = 200
                };
                return result;

            }
            catch (Exception e)
            {
                _logger.LogError($"Error occurred while fetching Authenticate Candidate: {e.Message}");
                result = new JsonResult(new { success = false, responseText = $"Error occurred while fetching Authenticate Candidate: {e.Message}" })
                {
                    StatusCode = 500
                };
                return result;
            }

        }

        public async Task<JsonResult> AuthenticateCandidateVerificationService(string authHeader)
        {
            JsonResult result;
            try
            {
                var token = authHeader.Substring("Bearer ".Length).Trim();
                if (authHeader.StartsWith("Bearer "))
                {
                    var jwtSettings = _configuration.GetSection("JwtSettings");

                    var tokenModel = new JwtTokenValidationRequest
                    {
                        Token = token,
                        SecretKey = jwtSettings["Secret"]!,
                        Issuer = jwtSettings["Issuer"]!,
                        Audience = jwtSettings["Audience"]!
                    };

                    var validToken = JwtTokenHelper.ValidateToken(tokenModel, out string candidateId);

                    if (validToken)
                    {
                        var loggedCandidate = await _uoWForCurrentService.CandidateRepository.SelectLoggedCandidateDetails(candidateId);
                        result = new JsonResult(new { loggedCandidate })
                        {
                            StatusCode = 200
                        };
                        return result;
                    }


                }

                result = new JsonResult(new { success = false, responseText = "No valid authorization token found" })
                {
                    StatusCode = 401
                };
                return result;


            }
            catch (Exception e)
            {
                _logger.LogError($"Error occurred while fetching Authenticate Candidate: {e.Message}");
                result = new JsonResult(new { success = false, responseText = $"Error occurred while fetching Authenticate Candidate: {e.Message}" })
                {
                    StatusCode = 500
                };
                return result;
            }

        }

        public async Task<JsonResult> UpdateAssessmentIsStartedStatusService(int id)
        {
            JsonResult result;
            try
            {
                var candidateCredential = new CandidateCredential()
                {
                    Id = id,
                    IsAssessmentStarted = true
                };
                await _uoWForCurrentService.CandidateCredentialRepository.UpdateAssessmentIsStartedStatus(candidateCredential);
                await _uoWForCurrentService.CommitAsync();

                result = new JsonResult(new { success = true, responseText = "Candidate Progress Successfully Updated" })
                {
                    StatusCode = 200
                };
                return result;

            }
            catch (Exception e)
            {
                _logger.LogError($"Error occurred while updating candidate progress: {e.Message}");

                result = new JsonResult(new
                    { success = false, responseText = $"Error occurred while updating candidate progress: {e.Message}" })
                {
                    StatusCode = 400
                };
                return result;

            }
        }

        public async Task<JsonResult> UpdateAssessmentIsFinishedStatusService(int id, int candidateId)
        {
            JsonResult result;
            try
            {
                var candidateCredential = new CandidateCredential()
                {
                    Id = id,
                    IsAssessmentFinished = true
                };

                var candidateHistory = new CandidateHistory()
                {
                    CandidateId = candidateId,
                    Name = "Assessment",
                    Type = "warning",
                    Description = "Completed their assessment",
                    CreatedDate = DateTime.UtcNow.AddHours(8),
                };

                await _uoWForCurrentService.CandidateCredentialRepository.SaveHistoryItem(candidateHistory);
                await _uoWForCurrentService.CandidateCredentialRepository.UpdateAssessmentIsFinishedStatus(candidateCredential);
                await _uoWForCurrentService.CommitAsync();

                result = new JsonResult(new { success = true, responseText = "Candidate Progress Successfully Updated" })
                {
                    StatusCode = 200
                };
                return result;

            }
            catch (Exception e)
            {
                _logger.LogError($"Error occurred while updating candidate progress: {e.Message}");

                result = new JsonResult(new
                    { success = false, responseText = $"Error occurred while updating candidate progress: {e.Message}" })
                {
                    StatusCode = 400
                };
                return result;

            }
        }

        public async Task<JsonResult> SubmitAssessmentAnswerService(AssessmentAnswerDto assessmentAnswerDto)
        {
            JsonResult result;
            try
            {
                var assessmentAnswer = new CandidateAnswer()
                {
                    
                    CandidateId = assessmentAnswerDto.CandidateId,
                    QuestionId = assessmentAnswerDto.QuestionId,
                };

                var questionDetails = await _uoWForCurrentService.CandidateRepository.RetrieveQuestionDetails(assessmentAnswerDto.QuestionId);
                
                var assessmentCorrection = new AssessmentCorrection()
                {
                    AssessmentId = assessmentAnswerDto.AssessmentId,
                    CandidateId = assessmentAnswerDto.CandidateId,
                    QuestionId = assessmentAnswerDto.QuestionId,
                    AnswerBody = assessmentAnswerDto.AssessmentAnswerBody,
                    Marks = assessmentAnswerDto.Marks,
                    IsMultipleChoice = assessmentAnswerDto.Type == 1,
                    IsCorrect = assessmentAnswerDto.AssessmentAnswerBody == questionDetails.Answers.AnswerBody,
                };

                if (assessmentAnswerDto.VideoFile != null)
                {
                    var rootFilePath = Path.Combine(_fileRootFolder, "candidate_profile", assessmentAnswer.CandidateId.ToString(),"video_assessment");
                    if (!Directory.Exists(rootFilePath))
                    {
                        Directory.CreateDirectory(rootFilePath);
                    }

                    var filePath = Path.Combine(rootFilePath, assessmentAnswerDto.VideoFile.FileName);

                    await using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await assessmentAnswerDto.VideoFile.CopyToAsync(stream);
                    }

                    assessmentAnswer.AssessmentAnswerBody = assessmentAnswerDto.VideoFile.FileName;
                }
                else
                {
                    assessmentAnswer.AssessmentAnswerBody = assessmentAnswerDto.AssessmentAnswerBody;
                }

                await _uoWForCurrentService.CandidateRepository.SubmitAssessmentCorrection(assessmentCorrection);
                await _uoWForCurrentService.CandidateRepository.SubmitCandidateAnswer(assessmentAnswer);
                await _uoWForCurrentService.CommitAsync();

                result = new JsonResult(new { success = true, responseText = "Answer Successfully Submitted!" })
                {
                    StatusCode = 200
                };
                return result;

            }
            catch (Exception e)
            {
                _logger.LogError($"Error occurred while submitting answer: {e.Message}");

                result = new JsonResult(new
                    { success = false, responseText = $"Error occurred while submitting answer: {e.Message}" })
                {
                    StatusCode = 400
                };
                return result;

            }
        }

        public async Task<JsonResult> SubmitCandidateSnapshotService(CandidateSnapshotDto candidateSnapshotDto)
        {
            JsonResult result;
            try
            {
                var candidateSnapshot = new CandidateSnapshot()
                {
                    CandidateId = candidateSnapshotDto.CandidateId,
                };
                var rootFilePath = Path.Combine(_fileRootFolder, "candidate_profile", candidateSnapshot.CandidateId.ToString(), "snapshot");
                if (!Directory.Exists(rootFilePath))
                {
                    Directory.CreateDirectory(rootFilePath);
                }

                var filePath = Path.Combine(rootFilePath, candidateSnapshotDto.SnapshotFile.FileName);

                await using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await candidateSnapshotDto.SnapshotFile.CopyToAsync(stream);
                }

                candidateSnapshot.FilePath = filePath;


                await _uoWForCurrentService.CandidateRepository.SubmitCandidateSnapshot(candidateSnapshot);
                await _uoWForCurrentService.CommitAsync();

                result = new JsonResult(new { success = true, responseText = "Snapshot Successfully Submitted!" })
                {
                    StatusCode = 200
                };
                return result;

            }
            catch (Exception e)
            {
                _logger.LogError($"Error occurred while submitting snapshot: {e.Message}");

                result = new JsonResult(new
                { success = false, responseText = $"Error occurred while submitting snapshot: {e.Message}" })
                {
                    StatusCode = 400
                };
                return result;

            }
        }
        public async Task<JsonResult> SubmitAssessmentDetailsService(int id, bool isFullscreenExit, bool isMouseExited)
        {
            JsonResult result;
            try
            {
                var candidateCredential = new CandidateCredential()
                {
                    Id = id,
                    IsFullscreenExit = isFullscreenExit,
                    IsMouseExited = isMouseExited
                };
                await _uoWForCurrentService.CandidateCredentialRepository.SubmitAssessmentDetails(candidateCredential);
                await _uoWForCurrentService.CommitAsync();

                result = new JsonResult(new { success = true, responseText = "Candidate Details Successfully Updated" })
                {
                    StatusCode = 200
                };
                return result;

            }
            catch (Exception e)
            {
                _logger.LogError($"Error occurred while updating candidate details: {e.Message}");

                result = new JsonResult(new
                    { success = false, responseText = $"Error occurred while updating candidate details: {e.Message}" })
                {
                    StatusCode = 400
                };
                return result;

            }
        }

        public async Task<JsonResult> SetAssessmentMouseOutService(int id, int mouseOutsideCounter)
        {
            JsonResult result;
            try
            {
                var candidateCredential = new CandidateCredential()
                {
                    Id = id,
                    MouseOutsideCounter = mouseOutsideCounter,
                };
                await _uoWForCurrentService.CandidateCredentialRepository.SetAssessmentMouseOut(candidateCredential);
                await _uoWForCurrentService.CommitAsync();

                result = new JsonResult(new { success = true, responseText = "Mouse Counter Successfully Updated" })
                {
                    StatusCode = 200
                };
                return result;

            }
            catch (Exception e)
            {
                _logger.LogError($"Error occurred while updating mouse counter: {e.Message}");

                result = new JsonResult(new
                    { success = false, responseText = $"Error occurred while updating mouse counter: {e.Message}" })
                {
                    StatusCode = 400
                };
                return result;

            }
        }

        public async Task<JsonResult> SetCurrentAssessmentIdService(int id, int assessmentId)
        {
            JsonResult result;
            try
            {
                var candidateCredential = new CandidateCredential()
                {
                    Id = id,
                    CurrentAssessmentId = assessmentId,
                };
                await _uoWForCurrentService.CandidateCredentialRepository.SetCurrentAssessmentId(candidateCredential);
                await _uoWForCurrentService.CommitAsync();

                result = new JsonResult(new { success = true, responseText = "Current Assessment Successfully Updated" })
                {
                    StatusCode = 200
                };
                return result;

            }
            catch (Exception e)
            {
                _logger.LogError($"Error occurred while updating current assessment: {e.Message}");

                result = new JsonResult(new
                    { success = false, responseText = $"Error occurred while updating current assessment: {e.Message}" })
                {
                    StatusCode = 400
                };
                return result;

            }
        }

        public async Task<JsonResult> SubmitAssessmentRemainingTimeService(AssessmentRemainingTimerDto assessmentRemainingTimerDto,int id)
        {
            JsonResult result;
            try
            {

                var assessmentRemainingTimer = new AssessmentRemainingTimer()
                {
                    RemainingTime = assessmentRemainingTimerDto.RemainingTime,
                    CandidateId = assessmentRemainingTimerDto.CandidateId,
                    AssessmentId = assessmentRemainingTimerDto.AssessmentId,
                };

                await _uoWForCurrentService.CandidateRepository.SubmitAssessmentRemainingTime(assessmentRemainingTimer);
                await _uoWForCurrentService.CommitAsync();

                await _uoWForCurrentService.CandidateCredentialRepository.UpdateAssessmentRemainingTimerId(id,  assessmentRemainingTimer.Id);
                await _uoWForCurrentService.CommitAsync();

                result = new JsonResult(new { success = true, responseText = "Assessment Remaining Timer Successfully Submitted!" })
                {
                    StatusCode = 200
                };
                return result;

            }
            catch (Exception e)
            {
                _logger.LogError($"Error occurred while submitting assessment remaining timer: {e.Message}");

                result = new JsonResult(new
                    { success = false, responseText = $"Error occurred while submitting assessment remaining timer: {e.Message}" })
                {
                    StatusCode = 400
                };
                return result;

            }
        }


        public async Task<JsonResult> UpdateAssessmentRemainingTimeService(int id, int remainingTime)
        {
            JsonResult result;
            try
            {
                await _uoWForCurrentService.CandidateRepository.UpdateAssessmentRemainingTime(id, remainingTime);
                await _uoWForCurrentService.CommitAsync();

                result = new JsonResult(new { success = true, responseText = "Remaining Timer Successfully Updated" })
                {
                    StatusCode = 200
                };
                return result;

            }
            catch (Exception e)
            {
                _logger.LogError($"Error occurred while updating remaining timer: {e.Message}");

                result = new JsonResult(new
                    { success = false, responseText = $"Error occurred while updating remaining timer: {e.Message}" })
                {
                    StatusCode = 400
                };
                return result;

            }
        }


        public async Task<(string filePath, string contentType)> RetrieveCandidateVideo(int answerId)
        {
            try
            {
                var candidateAnswer = await _uoWForCurrentService.CandidateRepository.RetrieveAnswerDetails(answerId);
                var rootFilePath = Path.Combine(_fileRootFolder!, "candidate_profile", candidateAnswer.CandidateId.ToString(), "video_assessment", candidateAnswer.VideoName);

                var (filePath, contentType) = await _fileService.GetDocumentUrlAsync($"{rootFilePath}");

                return (filePath, contentType);

            }
            catch (Exception e)
            {
                _logger.LogError($"Error occurred while retrieving candidate video answer: {e.Message}");

                throw new ArgumentOutOfRangeException($"Unable to find Content Type for file name {e.Message}.");

            }
        }

    }
}


