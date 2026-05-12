import { useState, useRef } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { DocumentMentionList, type DocumentsChat } from "./DocumentMentionList";

const MENTION_REGEX = /@(\S*)$/;
const SHARED_TEXT_STYLES =
  "w-full pl-4 pr-12 py-3 text-sm font-sans leading-5 whitespace-pre-wrap break-all overflow-hidden";

export interface ChatBotFooterInputProps {
  onSendMessage: (
    userQuestion: string,
    mentionedDocs: { postId: number; title: string }[],
  ) => void;
  isLoading: boolean;
  documents?: DocumentsChat[];
}

export function ChatBotFooterInput({
  onSendMessage,
  isLoading,
  documents = [],
}: ChatBotFooterInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [mentionFilter, setMentionFilter] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedMentions, setSelectedMentions] = useState<
    { postId: number; title: string }[]
  >([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const filteredDocs = documents.filter((doc) => {
    const title = doc.title;
    const matchesFilter = title
      .toLowerCase()
      .includes(mentionFilter.toLowerCase());
    const isAlreadyMentioned = inputValue.includes(`@${title}`);
    return matchesFilter && !isAlreadyMentioned;
  });

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return;
    onSendMessage(inputValue, selectedMentions);
    setInputValue("");
    setSelectedMentions([]);
    setShowMentions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = value.slice(0, cursorPosition);
    const match = textBeforeCursor.match(MENTION_REGEX);

    if (match) {
      setShowMentions(true);
      setMentionFilter(match[1]);
      setSelectedIndex(0);
    } else {
      setShowMentions(false);
    }
  };

  const selectDocument = (doc: DocumentsChat) => {
    if (!textareaRef.current) return;

    const cursor = textareaRef.current.selectionStart;

    const textBefore = inputValue
      .slice(0, cursor)
      .replace(MENTION_REGEX, `@${doc.title} `);
    const textAfter = inputValue.slice(cursor);

    setInputValue(textBefore + textAfter);
    setShowMentions(false);
    setSelectedMentions((prev) => {
      const docId = Number(doc.id);
      const alreadySelected = prev.some((d) => d.postId === docId);
      if (alreadySelected) return prev;
      return [...prev, { postId: docId, title: doc.title }];
    });
    textareaRef.current.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showMentions && filteredDocs.length > 0) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % filteredDocs.length);
          return;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex(
            (prev) => (prev - 1 + filteredDocs.length) % filteredDocs.length,
          );
          return;
        case "Enter":
        case "Tab":
          e.preventDefault();
          selectDocument(filteredDocs[selectedIndex]);
          return;
        case "Escape":
          setShowMentions(false);
          return;
        default:
          break;
      }
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderHighlightedText = () => {
    if (!inputValue) {
      return (
        <span className="text-gray-400">
          Escribe aquí (usa @ para mencionar un PDF)...
        </span>
      );
    }

    return inputValue.split(/(@\S+)/g).map((part, index) => {
      if (!part.startsWith("@")) {
        return (
          <span key={index} className="text-gray-900">
            {part}
          </span>
        );
      }

      const docName = part.slice(1);
      const isDocumentValid = documents.some((d) => d.title === docName);

      return (
        <span
          key={index}
          className={
            isDocumentValid
              ? "bg-blue-100 text-blue-700 rounded-sm"
              : "text-red-400"
          }
        >
          {part}
        </span>
      );
    });
  };

  return (
    <div className="p-3 border-t border-gray-200 bg-white relative">
      {showMentions && filteredDocs.length > 0 && (
        <DocumentMentionList
          docs={filteredDocs}
          selectedIndex={selectedIndex}
          onSelectDocument={selectDocument}
        />
      )}
      <div className="relative flex border border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 rounded-lg bg-white overflow-hidden items-end">
        <div className="grid w-full relative min-h-[44px]">
          <div
            className={`col-start-1 row-start-1 pointer-events-none text-left ${SHARED_TEXT_STYLES}`}
            aria-hidden="true"
          >
            {renderHighlightedText()}
            {inputValue.endsWith("\n") ? (
              <br />
            ) : (
              <span className="opacity-0">&#8203;</span>
            )}
          </div>
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            rows={1}
            className={`col-start-1 row-start-1 bg-transparent caret-black text-transparent outline-none resize-none m-0 border-0 ${SHARED_TEXT_STYLES}`}
            style={{ minHeight: "44px" }}
          />
        </div>

        <button
          onClick={handleSend}
          disabled={isLoading || !inputValue.trim()}
          className={`absolute right-2 bottom-1.5 p-2 transition-colors z-10 ${
            isLoading || !inputValue.trim()
              ? "text-gray-300"
              : "text-blue-600 hover:text-blue-800"
          }`}
        >
          <PaperAirplaneIcon className="w-5 h-5 -rotate-45" />
        </button>
      </div>
    </div>
  );
}
