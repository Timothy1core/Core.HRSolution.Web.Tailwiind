using Authentication;
using EmailServiceLibrary;
using FileServiceLibrary;
using HRApplicationDbLibrary.Core.DbContexts;
using HRApplicationDbLibrary.Persistence.DbContexts;
using HRSolutionDbLibrary.Core.DbContexts;
using HRSolutionDbLibrary.Persistence.DbContexts;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Recruitment.Service.API.Core.Applications;
using Recruitment.Service.API.Core.Repositories.CurrentService.Tables;
using Recruitment.Service.API.Core.UnitOfWork;
using Recruitment.Service.API.Persistence.Applications;
using Recruitment.Service.API.Persistence.Repositories.CurrentService.Tables;
using Recruitment.Service.API.Persistence.UnitOfWork;
using System.Net;
using Recruitment.Service.API.Core.Helpers;
using Recruitment.Service.API.Persistence.Helpers;
using OutlookServiceLibrary;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("application");
var systemOptionConnectionString = builder.Configuration.GetConnectionString("systemOptions");

builder.Services.AddDbContext<CurrentServiceDbContext>(options =>
	options.UseSqlServer(connectionString));

builder.Services.AddDbContext<HrSolutionApplicationDbContext>(options =>
	options.UseSqlServer(systemOptionConnectionString));

var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings.GetValue<string>("Secret");


builder.Services.AddSharedJwtAuthentication(
	authority: jwtSettings.GetValue<string>("Issuer"),
	audience: jwtSettings.GetValue<string>("Audience"),
secretKey: secretKey);

builder.Services.AddSharedJwtAuthenticationPermission();


var fileRootFolder = builder.Environment.IsDevelopment() ? builder.Environment.ContentRootPath : builder.Configuration.GetSection("baseFileLocation").Value;
builder.Services.AddScoped<IFileService>(_ => new FileService(fileRootFolder!));
builder.Services.AddScoped<IEmailService, EmailService>();

builder.Services.AddScoped<IHrSolutionApplicationDbContext, HrSolutionApplicationDbContext>();


builder.Services.AddScoped<ICurrentServiceDbContext, CurrentServiceDbContext>();
builder.Services.AddScoped<IDepartmentRepository, DepartmentRepository>();
builder.Services.AddScoped<IAssessmentRepository, AssessmentRepository>();
builder.Services.AddScoped<ICandidateRepository, CandidateRepository>();
builder.Services.AddScoped<IJobOfferRepository, JobOfferRepository>();
builder.Services.AddScoped<IUoWForCurrentService, UoWForCurrentService>();
builder.Services.AddScoped<IOnboardingRepository, OnboardingRepository>();

builder.Services.AddScoped<IAssessmentServices, AssessmentServices>();
builder.Services.AddScoped<IDepartmentServices, DepartmentServices>();
builder.Services.AddScoped<IJobProfileServices, JobProfileServices>();
builder.Services.AddScoped<ICandidateServices, CandidateServices>();
builder.Services.AddScoped<IJobOfferServices, JobOfferServices>();
builder.Services.AddScoped<IOnboardingServices, OnboardingServices>();


builder.Services.AddScoped<ITalentAcquisitionFormServices, TalentAcquisitionFormServices>();

builder.Services.AddScoped<IEmailTemplateServices, EmailTemplateServices>();


builder.Services.AddScoped<ITalentAcquisitionFormHelper, TalentAcquisitionFormHelper>();
builder.Services.AddScoped<IJobProfileHelper, JobProfileHelper>();
builder.Services.AddScoped<IApplicationProcessHelper, ApplicationProcessHelper>();




#region MyRegion

// Retrieve configuration values
var config = builder.Configuration.GetSection("AzureAd");
var tenantId = config["TenantId"];
var clientId = config["ClientId"];
var clientSecret = config["ClientSecret"];

// Register AuthProvider
builder.Services.AddSingleton(provider =>
	new GraphService(
		tenantId,
		clientId,
		clientSecret
	));

#endregion


builder.Services.AddRouting(options => options.LowercaseUrls = true);


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
	options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
	options.KnownProxies.Add(IPAddress.Parse("127.0.0.1")); // Add your proxy's IP address if needed
});


var app = builder.Build();
var logger = app.Services.GetRequiredService<ILogger<Program>>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

// app.UseHttpsRedirection();

app.UseAuthorization();

app.ConfigureExceptionHandler(logger);

app.MapControllers();

app.Run();
