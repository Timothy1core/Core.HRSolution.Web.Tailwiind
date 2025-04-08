using APIAuthentication.Core.Dtos.UserRole;
using HRApplicationDbLibrary.Core.Entities.Tables;

namespace APIAuthentication.Core.Repositories.HRSolution;

public interface IApiRepository
{
    public Task CreateApi(Api api);
    public Task<List<ApiDashboardDto>> RetrieveApiList();
    public Task<Api> RetrieveApiInfo(int apiId);
    public Task UpdateApi(Api api);
    public Task RemovedApi(int apiId);
}