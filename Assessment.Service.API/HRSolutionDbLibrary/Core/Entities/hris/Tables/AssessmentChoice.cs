#nullable disable
namespace HRSolutionDbLibrary.Core.Entities.hris.Tables;

public class AssessmentChoice
{
    public int Id { get; set; }

    public string ChoiceBody { get; set; }

    public int QuestionId { get; set; }

    public virtual AssessmentQuestion AssessmentQuestion { get; set; }
}