#nullable disable
namespace HRSolutionDbLibrary.Core.Entities.hris.Tables;

public class AssessmentVideoDuration
{
    public int Id { get; set; }

    public int QuestionId { get; set; }

    public int VideoDurationMinute { get; set; }

    public virtual AssessmentQuestion AssessmentQuestion { get; set; }
}