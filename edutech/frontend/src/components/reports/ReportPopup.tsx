import React, { useState, useEffect } from 'react';
import { FlagIcon } from '@heroicons/react/24/solid';
import Input from '../Input';
import { getReportReasons } from '../../services/interactions/connections-reports';
import type { ReportReason } from '../../models/documents/interactions/report.model';

export interface ReportSubmitData {
  reasonId: string;
  description: string;
}

export interface ReportPopupProps {
  isOpen: boolean;
  onClose: () => void;
  entity: string;
  onSubmit: (data: ReportSubmitData) => Promise<void>;
}

export default function ReportPopup({ isOpen, onClose, entity, onSubmit }: ReportPopupProps) {
  const [reasons, setReasons] = useState<ReportReason[]>([]);
  const [reasonId, setReasonId] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    getReportReasons()
      .then(setReasons)
      .catch(() => setReasons([]))
      .finally(() => setLoading(false));
  }, [isOpen]);

  const handleClose = () => {
    setReasonId('');
    setDescription('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!reasonId || !description.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({ reasonId, description });
      handleClose();
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="flex flex-col bg-white w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center px-6 py-5 border-b border-gray-100 gap-3">
          <FlagIcon className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-bold text-gray-800">Reportar {entity}</h3>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-6 py-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Motivo <span className="text-red-500">*</span></label>
            {loading ? (
              <div className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-400 bg-gray-50">
                Cargando motivos…
              </div>
            ) : (
              <select
                required
                value={reasonId}
                onChange={(e) => setReasonId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-red-400 outline-none transition-all bg-white text-gray-800 text-sm cursor-pointer"
              >
                <option value="" disabled>Selecciona un motivo…</option>
                {reasons.map(r => <option key={r.id} value={r.id}>{r.reason}</option>)}
              </select>
            )}
          </div>

          <Input
            label="Descripción"
            placeholder="Explica por qué este contenido infringe las normas…"
            textarea
            autoResize
            required
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
          />

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!reasonId || !description.trim() || submitting}
              className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm text-sm"
            >
              {submitting ? 'Enviando…' : 'Enviar reporte'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
