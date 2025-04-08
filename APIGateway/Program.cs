using Microsoft.AspNetCore.HttpOverrides;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;

var builder = WebApplication.CreateBuilder(args);

var env = builder.Environment;

// Configure JWT authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");

// Add CORS services
builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowSpecificOrigin",
		builder =>
		{
			builder.WithOrigins("http://localhost:5173") // Frontend origin
				.AllowAnyHeader()
				.AllowAnyMethod()
				.AllowCredentials();
		});
});

builder.Services.AddAuthentication("Bearer")
	.AddJwtBearer("Bearer", options =>
	{
		options.Authority = jwtSettings.GetValue<string>("Issuer"); // Identity server or auth provider
		options.RequireHttpsMetadata = false;
		options.Audience = jwtSettings.GetValue<string>("Audience");
	});


if (env.IsDevelopment())
{
	builder.Configuration.AddJsonFile($"ocelot.{env.EnvironmentName}.json", optional: true, reloadOnChange: true);
}
else
{
	builder.Configuration.AddJsonFile("ocelot.json");

}
builder.Services.AddHttpClient("OcelotHttpClient")
	.ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler
	{
		ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
	});
//builder.Configuration
//	.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true)
//	.AddJsonFile($"ocelot.{env.EnvironmentName}.json", optional: true, reloadOnChange: true);

builder.Services.AddOcelot();

var app = builder.Build();

app.UseCors("AllowSpecificOrigin");
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
	ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});
app.UseAuthentication();
app.UseRouting();
app.UseAuthorization();
app.UseOcelot().Wait();

app.Run();