#nullable disable
namespace HRSolutionDbLibrary.Core.Entities.Tables;

public class AssessmentAnswer
{
	public int Id { get; set; }

	public string AnswerBody { get; set; }

	public int QuestionId { get; set; }

	public virtual AssessmentQuestion Question { get; set; }
}