import Question from '../Question';


export function QuestionsGrid({questions, updateQuestion, deleteQuestion}) {
  return (<div className="space-y-6 mt-10">
    {questions.map((question) => (
      <div id={question.id} key={question.id} className="scroll-mt-24">
        <Question
          question={question}
          canDelete={questions.length > 1}
          onUpdate={(updated) => updateQuestion(question.id, updated)}
          onDelete={() => deleteQuestion(question.id)} />
      </div>
    ))}
  </div>)
}
