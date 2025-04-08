using APIAuthentication.Core.Dtos.UserRole;
using HRApplicationDbLibrary.Core.Entities.Tables;

namespace APIAuthentication.Core.Repositories.HRSolution;

public interface ISectionMenuRepository
{
    public Task CreateSectionMenu(SectionMenu sectionMenu);


    public Task<List<SectionMenuDashboardDto>> RetrieveSectionMenuList();


    public Task<SectionMenu> RetrieveSectionMenuInfo(int sectionMenuId);


    public Task UpdateSectionMenu(SectionMenu sectionMenu);


    public Task RemovedSectionMenu(int sectionMenuId);

}