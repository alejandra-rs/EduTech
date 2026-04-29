import { PlusCircleIcon, RocketLaunchIcon } from "@heroicons/react/24/solid";

export function AddQuestionButton({addQuestion, showSidebar}) {
  return (
  <button
    onClick={addQuestion}
    className={`fixed bottom-8 p-3 bg-blue-600 text-white rounded-full shadow-xl hover:bg-blue-700 active:scale-95 transition-all duration-200 z-50
          ${showSidebar ? 'right-[312px]' : 'right-8'}`}
  >
    <PlusCircleIcon className="w-8 h-8" />
  </button>
  )
}