from rest_framework import generics, status
from rest_framework.response import Response
from ..models import Post, FlashCardDeck
from ..serializers import FlashCardDeckUploadSerializer, PostSerializer


class FlashCardDeckUploadView(generics.GenericAPIView):
    serializer_class = FlashCardDeckUploadSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        post = Post.objects.create(
            title=data["title"],
            description=data["description"],
            course=data["course"],
            student=data.get("student"),
            post_type="FLA",
        )
        deck = FlashCardDeck.objects.create(post=post)
        for card_data in data["cards"]:
            deck.cards.create(question=card_data["question"], answer=card_data["answer"])

        return Response(PostSerializer(post).data, status=status.HTTP_201_CREATED)
