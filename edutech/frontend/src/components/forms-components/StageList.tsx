export interface Stage<K extends string = string> {
  key: K;
  label: string;
}

interface StageListProps<K extends string = string> {
  stages: Stage<K>[];
  currentStage: K | null;
  errorStage: K;
  errorMessage?: string;
  required?: boolean;
}

export default function StageList<K extends string = string>({
  stages,
  currentStage,
  errorStage,
  errorMessage,
  required = false,
}: StageListProps<K>) {
  const order = stages.map((s) => s.key);
  const isError = currentStage === errorStage;
  const currentIdx = isError || !currentStage ? -1 : order.indexOf(currentStage);

  return (
    <div className="px-4 py-3 space-y-2.5">
      {required && (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 uppercase tracking-wide mb-1">
          <span aria-hidden>*</span> Requerido
        </span>
      )}

      {isError ? (
        <p className="text-sm text-red-600 font-medium">{errorMessage ?? "Error en el procesamiento"}</p>
      ) : (
        stages.map((stage, i) => {
          const done = i < currentIdx;
          const active = i === currentIdx;
          const isLastDone = i === stages.length - 1 && currentIdx >= stages.length - 1;
          return (
            <div key={stage.key} className="flex items-center gap-3">
              <div className="shrink-0 w-5 h-5 flex items-center justify-center">
                {done || isLastDone ? (
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : active ? (
                  <svg className="w-4 h-4 text-indigo-500 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-gray-200 mx-auto block" />
                )}
              </div>
              <span className={`text-sm leading-tight
                ${isLastDone ? "text-green-600 font-semibold" : done ? "text-gray-400 line-through" : active ? "text-gray-900 font-semibold" : "text-gray-400"}`}>
                {stage.label}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
}
