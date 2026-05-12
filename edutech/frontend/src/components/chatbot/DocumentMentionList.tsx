import { DocumentIcon } from "@heroicons/react/24/solid";

export interface DocumentsChat {
  id: string | number;
  title: string;
}

export interface DocumentMentionListProps {
  docs: DocumentsChat[];
  selectedIndex: number;
  onSelectDocument: (doc: DocumentsChat) => void;
}

export function DocumentMentionList({
  docs,
  selectedIndex,
  onSelectDocument,
}: DocumentMentionListProps) {
  if (docs.length === 0) return null;

  return (
    <div className="absolute bottom-full left-3 w-64 bg-white border border-gray-200 rounded-lg shadow-xl mb-2 overflow-hidden z-50">
      <div className="p-2 bg-gray-50 text-xs font-semibold text-gray-500 border-b border-gray-200">
        Elige un documento para mencionar
      </div>
      <ul className="max-h-40 overflow-y-auto">
        {docs.map((doc, index) => (
          <li
            key={doc.id}
            onClick={() => onSelectDocument(doc)}
            className={`flex items-center gap-2 p-2 cursor-pointer text-sm ${
              index === selectedIndex
                ? "bg-blue-50 text-blue-700"
                : "hover:bg-gray-100"
            }`}
          >
            <DocumentIcon className="w-4 h-4 opacity-50" />
            <span className="truncate">{doc.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
