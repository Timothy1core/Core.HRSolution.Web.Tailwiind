using Authentication;
using EmailServiceLibrary;
using FileServiceLibrary;
using HRIS.Service.API.BackgroundServices;
using HRIS.Service.API.Core.Applications;
using HRIS.Service.API.Core.Helpers;
using HRIS.Service.API.Core.Repositories.CurrentService.Tables;
using HRIS.Service.API.Persistence.Applications;
using HRIS.Service.API.Persistence.Helpers;
using HRIS.Service.API.Persistence.Repositories.CurrentService.Tables;
using HRIS.Service.API.Persistence.UnitOfWork;
using HRSolutionDbLibrary.Core.DbContexts;
using HRSolutionDbLibrary.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Net;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("application");
var systemOptionConnectionString = builder.Configuration.GetConnectionString("systemOptions");

builder.Services.AddDbContext<HrisDbContext>(options =>
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
builder.Services.AddScoped<IUoWForCurrentService, UoWForCurrentService>();

builder.Services.AddScoped<IHrisDbContext, HrisDbContext>();
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddScoped<IEmployeeDependentRepository, EmployeeDependentRepository>();
builder.Services.AddScoped<IEmployeeDocumentRepository, EmployeeDocumentRepository>();
builder.Services.AddScoped<IEmployeeServices, EmployeeServices>();
builder.Services.AddScoped<IEmployeeDependentServices, EmployeeDependentServices>();
builder.Services.AddScoped<IEmployeeDocumentServices, EmployeeDocumentServices>();
builder.Services.AddScoped<IMilestoneService, MilestoneService>();
builder.Services.AddHostedService<MilestoneBackgroundService>();

builder.Services.AddScoped<IEmailAutomationHelper, EmailAutomationHelper>();




builder.Services.AddRouting(options => options.LowercaseUrls = true);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
var logger = app.Services.GetRequiredService<ILogger<Program>>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

app.UseAuthorization();
app.ConfigureExceptionHandler(logger);

app.MapControllers();

app.Run();
