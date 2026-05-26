import DownloadButton from './DownloadButton';
import { ViewsDisplay } from './interactions/Views';
import type { PostPreview } from '../models/documents/post.model';
import { formatDate } from '../formatters/dates';

export interface DocumentInfoProps {
  document: PostPreview | null;
  showDownload?: boolean;
}

export function DocumentInfo({ document, showDownload = true }: DocumentInfoProps) {
  return (
    <section className="flex flex-col bg-transparent">
      <div className="flex justify-between">
        <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-8">{document?.title}</h1>
        <time className="text-sm text-gray-500 mb-2" dateTime={document?.created_at}>
          {formatDate(document?.created_at)}
        </time>
      </div>
      <p className="text-2xl font-semibold text-gray-800 leading-relaxed mb-4">
        {(document as { description?: string } | null)?.description}
      </p>
      {showDownload && (
        <div className="mb-10 w-full">
          <DownloadButton postId={document?.id} />
        </div>
      )}
      <div className="pt-8 border-t border-gray-100">
        <ViewsDisplay views={document?.views} />
      </div>
    </section>
  );
}
