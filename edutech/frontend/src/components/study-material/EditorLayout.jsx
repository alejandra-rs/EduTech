import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EditorHeader from './EditorHeader';
import EditorSidebar from './EditorSidebar';
import SuccessToast from '../SuccessToast';
import { AddItemButton } from './AddItemButton';

export function EditorLayout({
  items, renderItem, onAdd, canPublish, requirements,
  onPublish, publishIcon, publishText, successMessage,
  itemLabel, titleLabel = "Título requerido",
}) {
  const { id, subjectId } = useParams();
  const navigate = useNavigate();

  const [header, setHeader] = useState({ title: '', description: '' });
  const [showSidebar, setShowSidebar] = useState(true);
  const [published, setPublished] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const isTitleValid = header.title.trim() !== "";
  const allCanPublish = canPublish && isTitleValid;
  const allRequirements = [
    ...(!isTitleValid ? [titleLabel] : []),
    ...requirements,
  ];

  const handlePublish = async () => {
    if (!allCanPublish || publishing) return;
    setPublishing(true);
    try {
      await onPublish(header);
      setPublished(true);
    } catch (e) {
      console.error(e);
    } finally {
      setPublishing(false);
    }
  };

  const handleToastClose = () => {
    setPublished(false);
    navigate(`/${id}/${subjectId}/post`);
  };

  const scrollTo = (itemId) => document.getElementById(itemId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  return (
    <>
      {published && <SuccessToast message={successMessage} onClose={handleToastClose} />}

      <EditorSidebar
        items={items}
        canPublish={allCanPublish && !publishing}
        showSidebar={showSidebar}
        onToggle={() => setShowSidebar(v => !v)}
        onPublish={handlePublish}
        onScrollTo={scrollTo}
        itemLabel={itemLabel}
        requirements={allRequirements}
      >
        {publishIcon}
        {publishing ? "Publicando…" : publishText}
      </EditorSidebar>

      <main className={`flex-1 transition-all max-w-4xl mx-auto p-12 pb-32 duration-300 ${showSidebar ? 'pr-72' : 'pr-0'}`}>
        <EditorHeader
          title={header.title}
          description={header.description}
          onTitleChange={(v) => setHeader(h => ({ ...h, title: v }))}
          onDescChange={(v) => setHeader(h => ({ ...h, description: v }))}
        />
        <div className="space-y-6 mt-10">
          {items.map((item) => (
            <div id={item.id} key={item.id} className="scroll-mt-24">
              {renderItem(item)}
            </div>
          ))}
        </div>
      </main>

      <AddItemButton onAdd={onAdd} showSidebar={showSidebar} />
    </>
  );
}
