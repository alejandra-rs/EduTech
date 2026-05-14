import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminWidget } from '../components/reports/AdminWidget';
import { TitlePage } from '../components/TitlePage';
import { DocumentReport } from '../components/reports/DocumentReport';
import { useCurrentUser } from '../services/useCurrentUser';
import { getReports, rejectPostReports } from '../services/interactions/connections-reports';
import { TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { PostType } from '../models/documents/post.model';
import type { Report, GroupedReport } from '../models/documents/interactions/report.model';

const TYPE_TO_PATH: Record<string, string> = { PDF: 'documento', VID: 'video', QUI: 'quiz', FLA: 'flashcard' };

export default function ReportsPage() {
  const [reports, setReports] = useState<GroupedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const { userData, isLoading: userLoading } = useCurrentUser();
  const navigate = useNavigate();

  const fetchReports = async () => {
    try {
      const data: Report[] = await getReports(userData!.id);
      setReports(groupByPost(data));
    } catch (err) {
      console.error("Error al cargar reportes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userLoading && (!userData || !userData.is_admin)) navigate('/');
  }, [userData, userLoading, navigate]);

  useEffect(() => {
    if (!userData?.id) return;
    fetchReports();
  }, [userData]);

  const groupByPost = (allReports: Report[]): GroupedReport[] => {
    const reportsByPost: Record<number, GroupedReport> = {};
    allReports.forEach((r) => {
      if (!reportsByPost[r.post.id]) {
        reportsByPost[r.post.id] = {
          postId: r.post.id, title: r.post.title,
          subject: r.post.course_name, type: r.post.post_type,
          courseId: r.post.course, yearId: r.post.year_id,
          reasons: [],
        };
      }
      reportsByPost[r.post.id].reasons.push({
        id: r.id,
        type: r.reason.reason,
        comment: r.description,
        date: new Date(r.created_at).toLocaleDateString('es-ES'),
      });
    });
    return Object.values(reportsByPost);
  };

  const handleReject = async (report: GroupedReport) => {
    try {
      await rejectPostReports(report.postId, userData!.id);
      setReports((prev) => prev.filter((r) => r.postId !== report.postId));
    } catch (err) {
      console.error("Error al descartar reporte:", err);
    }
  };

  const handleAccept = (report: GroupedReport) => navigate(`/admin/report-form/${report.postId}`, {
    state: { title: report.title, subject: report.subject },
  });

  if (loading) {
    return (
      <main className="flex items-center justify-center h-full">
        <p className="text-gray-400 italic">Cargando reportes</p>
      </main>
    );
  }

  return (
    <div className="flex flex-col mx-auto px-4 gap-7">
      <TitlePage
        PageName="Panel de Reportes"
        onBack={() => navigate(-1)}
      />
      <section className="space-y-4 px-10">
        {reports.length > 0 ? (
          reports.map((report) => {
            const documentPath = TYPE_TO_PATH[report.type] || 'documento';
            const documentUrl = report.yearId && report.courseId 
              ? `/${report.yearId}/${report.courseId}/${documentPath}/${report.postId}` 
              : null;

            return (
              <AdminWidget
                key={report.postId}
                title={report.title}
                subtitle={report.subject}
                type={report.type as PostType}
                url={documentUrl}
                collapsible={true}
                actions={[
                  {
                    label: 'Borrar Contenido',
                    icon: TrashIcon,
                    variant: 'danger',
                    onClick: () => handleAccept(report)
                  },
                  {
                    label: 'Descartar reportes',
                    confirmLabel: '¿Seguro?',
                    icon: XMarkIcon,
                    variant: 'secondary',
                    onClick: () => handleReject(report)
                  }
                ]}
              >
                <div className="max-h-80 overflow-y-auto space-y-2">
                  {report.reasons.map((r, idx) => (
                    <DocumentReport key={r.id ?? idx} {...r} />
                  ))}
                </div>
              </AdminWidget>
            );
          })
        ) : (
          <p className="text-gray-400 mt-10 text-center italic">No hay reportes pendientes de revisión.</p>
        )}
      </section>
    </div>
  );
}