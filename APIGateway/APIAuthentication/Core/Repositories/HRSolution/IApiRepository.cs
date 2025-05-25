using APIAuthentication.Core.Dtos.UserRole;
using HRSolutionDbLibrary.Core.Entities.application.Tables;

namespace APIAuthentication.Core.Repositories.HRSolution;

public interface IApiRepository
{
    public Task CreateApi(Api api);
    public Task<List<ApiDashboardDto>> RetrieveApiList();
    public Task<Api> RetrieveApiInfo(int apiId);
    public Task UpdateApi(Api api);
    public Task RemovedApi(int apiId);
}