import { PostPreview } from '../models/post.model';

const TYPE_MAP = {
  'PDF': 'pdf',
  'VID': 'video',
  'QUI': 'cuestionario',
  'FLA': 'flashcard'
} as const;

export const getMyPosts = async (userId: string): Promise<PostPreview[]> => {
  const response = await fetch(`/api/documents/?student=${userId}`);
  const data = await response.json();
  
  const formattedPosts: PostPreview[] = data.map((post: any) => ({
    ...post,
    extendedType: TYPE_MAP[post.post_type as keyof typeof TYPE_MAP]
  }));

  return formattedPosts;
};
