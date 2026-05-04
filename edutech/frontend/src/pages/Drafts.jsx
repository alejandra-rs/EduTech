import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDrafts, deleteDraft } from '@services/connections-documents';
import { useCurrentUser } from '@services/useCurrentUser';
import { TitlePage } from '../components/TitlePage';
import DraftCard from '../components/DraftCard';

export default function Drafts() {
  const navigate = useNavigate();
  const { userData } = useCurrentUser();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!userData?.id) return;
    getDrafts(userData.id)
      .then(data => { 
        const filtered = data.filter(d => d.post_type === "FLA" || d.post_type === "QUI");
        setDrafts(filtered);
      })
      .finally(() => setLoading(false));
  }, [userData?.id]);

  const handleDelete = async (draftId) => {
    setDeletingId(draftId);
    try {
      await deleteDraft(draftId);
      setDrafts(prev => prev.filter(d => d.id !== draftId));
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <TitlePage PageName="Mis borradores" backLabel="Inicio" onBack={() => navigate("/")} />
      <main className="max-w-3xl mx-auto px-6 py-6">
        {loading && (
          <p className="text-sm text-gray-400 text-center mt-16">Cargando borradores…</p>
        )}
        {!loading && drafts.length === 0 && (
          <div className="text-center mt-24">
            <p className="text-gray-400 text-sm">No tienes borradores guardados.</p>
          </div>
        )}
        <div className="space-y-4">
          {drafts.map(draft => (
            <DraftCard
              key={draft.id}
              draft={draft}
              deleting={deletingId === draft.id}
              onDelete={() => handleDelete(draft.id)}
            />
          ))}
        </div>
      </main>
    </>
  );
}
