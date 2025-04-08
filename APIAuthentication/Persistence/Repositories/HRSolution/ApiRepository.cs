using APIAuthentication.Core.Dtos.UserRole;
using APIAuthentication.Core.Repositories.HRSolution;
using HRApplicationDbLibrary.Core.Entities.Tables;
using HRApplicationDbLibrary.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace APIAuthentication.Persistence.Repositories.HRSolution;

public class ApiRepository(HrSolutionApplicationDbContext context) : IApiRepository
{
    public async Task CreateApi(Api api)
    {
        await context.Apis.AddAsync(api);

    }

    public async Task<List<ApiDashboardDto>> RetrieveApiList()
    {
        var apiPermissionList = await context.Apis
            .Where(x => x.IsActive)
            .Select(s => new ApiDashboardDto()
            {
                Id = s.Id,
                ApiPermission = s.ApiPermission,
                IsActive = s.IsActive,
                CreatedDate = s.CreatedDate
            })
            .ToListAsync();

        return apiPermissionList;
    }

    public async Task<Api> RetrieveApiInfo(int apiId)
    {
        var api = await context.Apis
            .FirstOrDefaultAsync(x => x.Id == apiId && x.IsActive);

        return api!;
    }

    public async Task UpdateApi(Api api)
    {
        var apiData = await context.Apis.FirstOrDefaultAsync(x => x.Id == api.Id);

        if (apiData != null)
        {
            apiData.Id = api.Id;
            apiData.ApiPermission = api.ApiPermission;
        }
    }

    public async Task RemovedApi(int apiId)
    {
        var api = await context.Apis.FirstOrDefaultAsync(x => x.Id == apiId);

        if (api != null) api.IsActive = false;
    }

}