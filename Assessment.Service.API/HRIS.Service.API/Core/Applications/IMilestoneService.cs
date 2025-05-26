namespace HRIS.Service.API.Core.Applications
{
	public interface IMilestoneService
	{
		Task CheckAndAddTodayMilestonesAsync();
	}
}
