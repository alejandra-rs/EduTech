import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useNavigationGuard } from '../../context/NavigationGuardContext';
import EditorHeader from './EditorHeader';
import { EditorSidebar, EditorSidebarProps } from './EditorSidebar';
import ConfirmModal from './ConfirmModal';
import SuccessToast from '../SuccessToast';
import { AddItemButton } from './AddItemButton';
import { TitlePage } from '../TitlePage';
import { EditorHeaderData } from '../../models/documents/post.model';

export interface EditorLayoutProps<T extends { id: string | number }> {
  items: T[];
  renderItem: (item: T) => ReactNode;
  onAdd: () => void;
  canPublish: boolean;
  requirements: string[];
  onPublish: (header: EditorHeaderData) => Promise<void>;
  onSaveDraft?: (header: EditorHeaderData) => Promise<void>;
  publishIcon: ReactNode;
  publishText: string;
  successMessage: string;
  itemLabel: (item: T) => string;
  titleLabel?: string;
  isDirty?: boolean;
  pageTitle: string;
  backPath?: string;
  publishSuccessPath?: string;
  initialHeader?: EditorHeaderData | null;
}


export function EditorLayout<T extends { id: string | number }>({
  items, renderItem, onAdd, canPublish, requirements,
  onPublish, onSaveDraft, publishIcon, publishText, successMessage,
  itemLabel, titleLabel = "Título requerido", isDirty: itemsDirty = false,
  pageTitle, backPath, publishSuccessPath, initialHeader,
}: EditorLayoutProps<T>){
  const { id, subjectId } = useParams<{ id: string; subjectId: string }>();
  const navigate = useNavigate();

  const [header, setHeader] = useState<EditorHeaderData>(initialHeader ?? { title: '', description: '' });
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [published, setPublished] = useState<boolean>(false);
  const [publishing, setPublishing] = useState<boolean>(false);
  const [savingDraft, setSavingDraft] = useState<boolean>(false);
  const [draftSaved, setDraftSaved] = useState<boolean>(false);
  
  const [pendingNav, setPendingNav] = useState<(() => void) | null>(null);

  const { registerGuard, unregisterGuard } = useNavigationGuard();

  const isDirty = !published && (
    header.title.trim() !== '' ||
    header.description.trim() !== '' ||
    itemsDirty
  );

  useEffect(() => {
    if (isDirty) {
      registerGuard((proceed: () => void) => setPendingNav(() => proceed));
    } else {
      unregisterGuard();
    }
    return () => unregisterGuard();
  }, [isDirty, registerGuard, unregisterGuard]);

  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => { 
      e.preventDefault(); 
      e.returnValue = ''; 
    };
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

  const scrollTo = (itemId: string| number) => document.getElementById(String(itemId))?.scrollIntoView({ behavior: 'smooth', block: 'center' });


  const sidebarProps: EditorSidebarProps<T> = {
    items,
    canPublish: allCanPublish && !publishing,
    showSidebar,
    onToggle: () => setShowSidebar(v => !v),
    onPublish: handlePublish,
    onSaveDraft: onSaveDraft ? handleSaveDraft : undefined,
    savingDraft,
    draftSaved,
    onScrollTo: scrollTo,
    itemLabel,
    requirements: allRequirements
  };

  return (
    <>
      {published && <SuccessToast message={successMessage} onClose={handleToastClose} />}

      <ConfirmModal
        open={pendingNav !== null}
        title="¿Salir sin guardar?"
        message="Se perderá todo el progreso no guardado."
        confirmLabel="Salir"
        Icon={TrashIcon}
        onConfirm={() => { 
          if (pendingNav) pendingNav(); 
          setPendingNav(null); 
        }}
        onCancel={() => setPendingNav(null)}
      />

      <EditorSidebar {...sidebarProps}>
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
          onTitleChange={(v: string) => setHeader(h => ({ ...h, title: v }))}
          onDescChange={(v: string) => setHeader(h => ({ ...h, description: v }))}
        />
        <div className="space-y-6 mt-10">
          {items.map((item) => (
            <div id={String(item.id)} key={item.id} className="scroll-mt-24">
              {renderItem(item)}
            </div>
          ))}
        </div>
      </main>

      <AddItemButton onAdd={onAdd} showSidebar={showSidebar} />
    </>
  );
}
