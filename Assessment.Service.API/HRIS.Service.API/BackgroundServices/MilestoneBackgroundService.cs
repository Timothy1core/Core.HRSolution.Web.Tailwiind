using HRIS.Service.API.Core.Applications;

namespace HRIS.Service.API.BackgroundServices
{
	public class MilestoneBackgroundService : BackgroundService
	{
		private readonly IServiceProvider _serviceProvider;
		private DateTime _lastRunDate = DateTime.MinValue;
		private readonly ILogger<MilestoneBackgroundService> _logger;
		public MilestoneBackgroundService(IServiceProvider serviceProvider, ILogger<MilestoneBackgroundService> logger)
		{
			_serviceProvider = serviceProvider;
			_logger = logger;
		}

		protected override async Task ExecuteAsync(CancellationToken stoppingToken)
		{
			while (!stoppingToken.IsCancellationRequested)
			{
				var now = DateTime.Now;

				//if (now.Hour == 0 && now.Minute == 0) // runs at midnight
				//{
				//	using var scope = _serviceProvider.CreateScope();
				//	var milestoneService = scope.ServiceProvider.GetRequiredService<IMilestoneService>();
				//	await milestoneService.CheckAndAddTodayMilestonesAsync();
				//}

				// Run only once per day at 3:30 PM
				if (now.Hour == 7 && now.Minute == 51 && _lastRunDate.Date != now.Date)
				{
					using var scope = _serviceProvider.CreateScope();
					var milestoneService = scope.ServiceProvider.GetRequiredService<IMilestoneService>();
					await milestoneService.CheckAndAddTodayMilestonesAsync();

					_lastRunDate = now.Date;

					_logger.LogInformation("✅ Milestone service triggered at: {time}", now);
				}

				await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
			}
		}
	}

}
