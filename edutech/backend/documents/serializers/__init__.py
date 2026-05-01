import urllib.request
import urllib.parse

from .attachments import (
    PDFAttachmentSerializer,
    YoutubeVideoSerializer,
    PDFUploadSerializer,
    VideoUploadSerializer,
)
from .quiz import (
    AnswerSerializer,
    QuestionSerializer,
    QuizSerializer,
    QuizPreviewSerializer,
    AnswerUploadSerializer,
    QuestionUploadSerializer,
    QuizUploadSerializer,
    QuizResponseSerializer,
    QuizCheckSerializer,
)
from .flashcard import (
    FlashCardSerializer,
    FlashCardDeckSerializer,
    FlashCardDeckPreviewSerializer,
    FlashCardUploadSerializer,
    FlashCardDeckUploadSerializer,
)
from .interactions import CommentListSerializer, LikeSerializer, DislikeSerializer
from .post import PostPreviewSerializer, PostSerializer
from .draft import (
    DraftPostSerializer,
    DraftCardInputSerializer,
    DraftAnswerInputSerializer,
    DraftQuestionInputSerializer,
    DraftCreateSerializer,
    DraftUpdateSerializer,
)
