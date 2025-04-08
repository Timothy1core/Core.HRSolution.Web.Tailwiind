using APIAuthentication.Core.Dtos.UserRole;
using APIAuthentication.Core.Repositories.HRSolution;
using HRApplicationDbLibrary.Core.Entities.Tables;
using HRApplicationDbLibrary.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace APIAuthentication.Persistence.Repositories.HRSolution;

public class SectionMenuRepository(HrSolutionApplicationDbContext context) : ISectionMenuRepository
{
    public async Task CreateSectionMenu(SectionMenu sectionMenu)
    {
        await context.SectionMenus.AddAsync(sectionMenu);

    }

    public async Task<List<SectionMenuDashboardDto>> RetrieveSectionMenuList()
    {
        var sectionMenuList = await context.SectionMenus
            .Where(x => x.IsActive)
            .Select(s => new SectionMenuDashboardDto()
            {
                Id = s.Id,
                SectionName = s.SectionName,
                IsActive = s.IsActive,
                CreatedDate = s.CreatedDate,
                OrderBy = s.OrderBy
            })
            .ToListAsync();

        return sectionMenuList;
    }

    public async Task<SectionMenu> RetrieveSectionMenuInfo(int sectionMenuId)
    {
        var sectionMenu = await context.SectionMenus
            .FirstOrDefaultAsync(x => x.Id == sectionMenuId && x.IsActive);

        return sectionMenu!;
    }

    public async Task UpdateSectionMenu(SectionMenu sectionMenu)
    {
        var sectionMenuData = await context.SectionMenus.FirstOrDefaultAsync(x => x.Id == sectionMenu.Id);

        if (sectionMenuData != null)
        {
            sectionMenuData.OrderBy = sectionMenu.OrderBy;
            sectionMenuData.SectionName = sectionMenu.SectionName;
        }
    }

    public async Task RemovedSectionMenu(int sectionMenuId)
    {
        var sectionMenu = await context.SectionMenus.FirstOrDefaultAsync(x => x.Id == sectionMenuId);

        if (sectionMenu != null) sectionMenu.IsActive = false;
    }
}