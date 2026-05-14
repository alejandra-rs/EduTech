import urllib.request  # noqa: F401 — patched in BDD/tests as documents.serializers.urllib.request
import urllib.parse  # noqa: F401 — patched in BDD/tests as documents.serializers.urllib.parse

from .attachments import (
    PDFAttachmentSerializer as PDFAttachmentSerializer,
    YoutubeVideoSerializer as YoutubeVideoSerializer,
    PDFUploadSerializer as PDFUploadSerializer,
    VideoUploadSerializer as VideoUploadSerializer,
)
from .quiz import (
    AnswerSerializer as AnswerSerializer,
    QuestionSerializer as QuestionSerializer,
    QuizSerializer as QuizSerializer,
    QuizPreviewSerializer as QuizPreviewSerializer,
    AnswerUploadSerializer as AnswerUploadSerializer,
    QuestionUploadSerializer as QuestionUploadSerializer,
    QuizUploadSerializer as QuizUploadSerializer,
    QuizResponseSerializer as QuizResponseSerializer,
    QuizCheckSerializer as QuizCheckSerializer,
)
from .flashcard import (
    FlashCardSerializer as FlashCardSerializer,
    FlashCardDeckSerializer as FlashCardDeckSerializer,
    FlashCardDeckPreviewSerializer as FlashCardDeckPreviewSerializer,
    FlashCardUploadSerializer as FlashCardUploadSerializer,
    FlashCardDeckUploadSerializer as FlashCardDeckUploadSerializer,
)
from .interactions import (
    CommentListSerializer as CommentListSerializer,
    LikeSerializer as LikeSerializer,
    DislikeSerializer as DislikeSerializer,
)
from .reports import (
    ReportSerializer as ReportSerializer,
    ReportReasonSerializer as ReportReasonSerializer,
    ReportResolutionSerializer as ReportResolutionSerializer,
    CommentReportSerializer as CommentReportSerializer,
)
from .post import (
    PostPreviewSerializer as PostPreviewSerializer,
    PostSerializer as PostSerializer,
)
from .revision import RevisionNoteSerializer as RevisionNoteSerializer
from .draft import (
    DraftPostSerializer as DraftPostSerializer,
    DraftCardInputSerializer as DraftCardInputSerializer,
    DraftAnswerInputSerializer as DraftAnswerInputSerializer,
    DraftQuestionInputSerializer as DraftQuestionInputSerializer,
    DraftCreateSerializer as DraftCreateSerializer,
    DraftUpdateSerializer as DraftUpdateSerializer,
)
