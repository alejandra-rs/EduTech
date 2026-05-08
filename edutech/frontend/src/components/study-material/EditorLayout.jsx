import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useNavigationGuard } from '../../context/NavigationGuardContext';
import EditorHeader from './EditorHeader';
import EditorSidebar from './EditorSidebar';
import ConfirmModal from './ConfirmModal';
import SuccessToast from '../SuccessToast';
import { AddItemButton } from './AddItemButton';
import { TitlePage } from '../TitlePage';

export function EditorLayout({
  items, renderItem, onAdd, canPublish, requirements,
  onPublish, onSaveDraft, publishIcon, publishText, successMessage,
  itemLabel, titleLabel = "Título requerido", isDirty: itemsDirty = false,
  pageTitle, backPath, publishSuccessPath, initialHeader,
}) {
  const { id, subjectId } = useParams();
  const navigate = useNavigate();

  const [header, setHeader] = useState(initialHeader ?? { title: '', description: '' });
  const [showSidebar, setShowSidebar] = useState(true);
  const [published, setPublished] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [pendingNav, setPendingNav] = useState(null);

  const { registerGuard, unregisterGuard } = useNavigationGuard();

  const isDirty = !published && (
    header.title.trim() !== '' ||
    header.description.trim() !== '' ||
    itemsDirty
  );

  // Register/unregister the navigation guard based on dirty state
  useEffect(() => {
    if (isDirty) {
      registerGuard((proceed) => setPendingNav(() => proceed));
    } else {
      unregisterGuard();
    }
    return () => unregisterGuard();
  }, [isDirty]);

  // Block browser refresh / tab close when dirty
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

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

  const handleSaveDraft = async () => {
    if (!onSaveDraft || savingDraft) return;
    setSavingDraft(true);
    setDraftSaved(false);
    try {
      await onSaveDraft(header);
      setDraftSaved(true);
    } catch (e) {
      console.error(e);
    } finally {
      setSavingDraft(false);
    }
  };

  const resolvedBackPath = backPath ?? `/${id}/${subjectId}/post`;
  const resolvedSuccessPath = publishSuccessPath ?? `/${id}/${subjectId}/post`;

  const handleToastClose = () => {
    setPublished(false);
    navigate(resolvedSuccessPath);
  };

  const scrollTo = (itemId) => document.getElementById(itemId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  return (
    <>
      {published && <SuccessToast message={successMessage} onClose={handleToastClose} />}

      <ConfirmModal
        open={pendingNav !== null}
        title="¿Salir sin guardar?"
        message="Se perderá todo el progreso no guardado."
        confirmLabel="Salir"
        Icon={TrashIcon}
        onConfirm={() => { const go = pendingNav; setPendingNav(null); go(); }}
        onCancel={() => setPendingNav(null)}
      />

      <EditorSidebar
        items={items}
        canPublish={allCanPublish && !publishing}
        showSidebar={showSidebar}
        onToggle={() => setShowSidebar(v => !v)}
        onPublish={handlePublish}
        onSaveDraft={onSaveDraft ? handleSaveDraft : undefined}
        savingDraft={savingDraft}
        draftSaved={draftSaved}
        onScrollTo={scrollTo}
        itemLabel={itemLabel}
        requirements={allRequirements}
      >
        {publishIcon}
        {publishing ? "Publicando…" : publishText}
      </EditorSidebar>

      <TitlePage
        PageName={pageTitle}
        onBack={() => {
          if (isDirty) setPendingNav(() => () => navigate(resolvedBackPath));
          else navigate(resolvedBackPath);
        }}
      />

      <main className={`flex-1 transition-all mx-auto px-8 py-6 pb-32 duration-300 ${showSidebar ? 'pr-80' : ''}`}>
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
