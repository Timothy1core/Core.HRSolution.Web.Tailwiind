#nullable disable
namespace HRSolutionDbLibrary.Core.Entities.Tables;

public class AssessmentVideoDuration
{
    public int Id { get; set; }

    public int QuestionId { get; set; }

    public int VideoDurationMinute { get; set; }

    public virtual AssessmentQuestion AssessmentQuestion { get; set; }
}