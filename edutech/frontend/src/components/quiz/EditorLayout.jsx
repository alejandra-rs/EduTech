import React, { useState } from 'react';
import QuizHeader from './QuizHeader';
import QuizSidebar from './QuizSidebar';
import SuccessToast from '../SuccessToast';
import { AddQuestionButton } from './AddQuestionButton';
import { ItemsGrid } from './ItemsGrid';

export function EditorLayout({
  header, setHeader, items, renderItem, onAdd,
  canPublish, requirements, onPublish,
  publishIcon, publishText, successMessage, itemLabel
}) {
  const [showSidebar, setShowSidebar] = useState(true);
  const [published, setPublished] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const handlePublishClick = async () => {
    if (!canPublish || publishing) return;
    setPublishing(true);
    try {
      await onPublish(); // El padre ejecuta la lógica (console.log del JSON)
      setPublished(true);
    } catch (e) {
      console.error(e);
    } finally {
      setPublishing(false);
    }
  };

  // TODO: ver que hace esto y si se puede mejorar
  const scrollToItem = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  return (
    <>
      {published && <SuccessToast message={successMessage} onClose={() => setPublished(false)} />}

      <QuizSidebar
        items={items}
        canPublish={canPublish && !publishing}
        showSidebar={showSidebar}
        onToggle={() => setShowSidebar(v => !v)}
        onPublish={handlePublishClick}
        onScrollTo={scrollToItem}
        itemLabel={itemLabel}
        requirements={requirements}
      >
        {publishIcon}
        {publishing ? "Publicando…" : publishText}
      </QuizSidebar>

      <main className={`flex-1 transition-all max-w-4xl mx-auto p-12 pb-32 duration-300 ${showSidebar ? 'pr-72' : 'pr-0'}`}>
        <QuizHeader
          title={header.title}
          description={header.description}
          onTitleChange={(v) => setHeader(h => ({ ...h, title: v }))}
          onDescChange={(v) => setHeader(h => ({ ...h, description: v }))}
        />
        <ItemsGrid items={items} renderItem={renderItem} />
      </main>

      <AddQuestionButton addQuestion={onAdd} showSidebar={showSidebar} />
    </>
  );
}