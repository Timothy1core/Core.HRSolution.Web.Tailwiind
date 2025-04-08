using Assessment.Service.API.Core.Applications;
using Assessment.Service.API.Core.Repositories.CurrentService.Tables;
using Authentication;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Infrastructure.Internal;
using Assessment.Service.API.Core.UnitOfWork;
using Assessment.Service.API.Persistence.Applications;
using Assessment.Service.API.Persistence.EntityConfigurations.CurrentService.Tables;
using Assessment.Service.API.Persistence.UnitOfWork;
using HRSolutionDbLibrary.Core.DbContexts;
using HRSolutionDbLibrary.Persistence.DbContexts;
using FileServiceLibrary;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Replace with your front-end URL
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials(); // If you need cookies/auth headers
    });
});

var connectionString = builder.Configuration.GetConnectionString("application");

builder.Services.AddDbContext<CurrentServiceDbContext>(options =>
    options.UseSqlServer(connectionString));
// Add services to the container.

// Configure JWT authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings.GetValue<string>("Secret");


builder.Services.AddSharedJwtAuthentication(
    authority: jwtSettings.GetValue<string>("Issuer"),
    audience: jwtSettings.GetValue<string>("Audience"),
    secretKey: secretKey);

builder.Services.AddSharedJwtAuthenticationPermission();

var fileRootFolder = builder.Environment.IsDevelopment() ? builder.Environment.ContentRootPath : builder.Configuration.GetSection("baseFileLocation").Value;
builder.Services.AddScoped<IFileService>(_ => new FileService(fileRootFolder!));

builder.Services.AddScoped<IUoWForCurrentService, UoWForCurrentService>();
builder.Services.AddScoped<ICurrentServiceDbContext, CurrentServiceDbContext>();
builder.Services.AddScoped<ICandidateCredentialRepository, CandidateCredentialRepository>();
builder.Services.AddScoped<ICandidateRepository, CandidateRepository>();
builder.Services.AddScoped<IAssessmentServices, AssessmentServices>();

builder.Services.AddRouting(options => options.LowercaseUrls = true);

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
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

app.UseAuthentication();
app.UseAuthorization();
app.ConfigureExceptionHandler(logger);
app.UseCors("AllowSpecificOrigins");
app.MapControllers();

app.Run();
