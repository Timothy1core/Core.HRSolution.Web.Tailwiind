using APIAuthentication.Core.Application;
using APIAuthentication.Core.Repositories.HRSolution;
using APIAuthentication.Core.UnitOfWork;
using APIAuthentication.Persistence.Application;
using APIAuthentication.Persistence.Repositories.HRSolution;
using APIAuthentication.Persistence.UnitOfWork;
using Authentication;
using HRApplicationDbLibrary.Core.DbContexts;
using HRApplicationDbLibrary.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.


var connectionString = builder.Configuration.GetConnectionString("application");

builder.Services.AddDbContext<HrSolutionApplicationDbContext>(options =>
	options.UseSqlServer(connectionString));




// Configure JWT authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings.GetValue<string>("Secret");


builder.Services.AddSharedJwtAuthentication(
	authority: jwtSettings.GetValue<string>("Issuer"),
	audience: jwtSettings.GetValue<string>("Audience"),
	secretKey: secretKey);

builder.Services.AddSharedJwtAuthenticationPermission();

builder.Services.AddScoped<IHrSolutionApplicationDbContext, HrSolutionApplicationDbContext>();
builder.Services.AddScoped<IUserCredentialRepository, UserCredentialRepository>();
builder.Services.AddScoped<IUserDetailRepository, UserDetailRepository>();
builder.Services.AddScoped<IUserMenuAccessRepository, UserMenuAccessRepository>();
builder.Services.AddScoped<IUoWForHrSolutionApplication, UoWForHrSolutionApplication>();
builder.Services.AddScoped<IUserCredentialService, UserCredentialService>();
builder.Services.AddScoped<ISystemSetupService, SystemSetupService>();

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

app.UseAuthentication(); 
app.UseAuthorization();
app.ConfigureExceptionHandler(logger);


app.MapControllers();

app.Run();
