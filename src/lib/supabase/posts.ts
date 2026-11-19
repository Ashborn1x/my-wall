import type { AlbumAttachment, LinkAttachment, PrivacyOption } from '../../types/wall';
import { getSupabaseClient } from './client';

export interface CommentRecord {
  id: string;
  post_id: string;
  author_name: string;
  author_avatar: string;
  content: string;
  created_at: string;
  likes: number;
}

export interface PostRecord {
  id: string;
  author_name: string;
  author_avatar: string;
  content: string;
  created_at: string;
  category: 'status' | 'photos' | 'wall';
  privacy: PrivacyOption | null;
  likes: number;
  show_wall_to_wall: boolean;
  album: AlbumAttachment | null;
  link_attachment: LinkAttachment | null;
  photo_attachment: string | null;
  comments: CommentRecord[];
}

const MAX_CONTENT_LENGTH = 280;
const POST_COLUMNS = 'id, author_name, author_avatar, content, created_at, category, privacy, likes, show_wall_to_wall, album, link_attachment, photo_attachment';
const COMMENT_COLUMNS = 'id, post_id, author_name, author_avatar, content, created_at, likes';

function requireClient() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase is not configured. Add the URL and anon key to your .env.local file.');
  }
  return supabase;
}

function validateContent(value: string): string {
  const content = value.trim();
  if (!content) throw new Error('Write a message before sharing.');
  if (Array.from(content).length > MAX_CONTENT_LENGTH) {
    throw new Error('Messages must be 280 characters or fewer.');
  }
  return content;
}

export async function fetchLatestPosts(): Promise<PostRecord[]> {
  const supabase = requireClient();
  const { data, error } = await supabase
    .from('posts')
    .select(POST_COLUMNS)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw new Error(error.message);
  const records = (data ?? []) as unknown as Omit<PostRecord, 'comments'>[];
  if (records.length === 0) return [];

  const { data: comments, error: commentsError } = await supabase
    .from('comments')
    .select(COMMENT_COLUMNS)
    .in('post_id', records.map((post) => post.id))
    .order('created_at', { ascending: true });

  if (commentsError) throw new Error(commentsError.message);
  const commentsByPost = new Map<string, CommentRecord[]>();
  ((comments ?? []) as unknown as CommentRecord[]).forEach((comment) => {
    const attached = commentsByPost.get(comment.post_id) ?? [];
    attached.push(comment);
    commentsByPost.set(comment.post_id, attached);
  });

  return records.map((post) => ({ ...post, comments: commentsByPost.get(post.id) ?? [] }));
}

export async function createPost(input: {
  content: string;
  privacy: PrivacyOption;
  linkAttachment?: LinkAttachment;
  photoAttachment?: string;
}): Promise<PostRecord> {
  const content = validateContent(input.content);
  const supabase = requireClient();
  const { data, error } = await supabase
    .from('posts')
    .insert({
      author_name: 'Jon',
      author_avatar: '/assets/aistudio/image_d0e5de4a.png',
      content,
      category: input.photoAttachment ? 'photos' : 'status',
      privacy: input.privacy,
      link_attachment: input.linkAttachment ?? null,
      photo_attachment: input.photoAttachment ?? null,
    })
    .select(POST_COLUMNS)
    .single();

  if (error) throw new Error(error.message);
  return { ...(data as unknown as Omit<PostRecord, 'comments'>), comments: [] };
}

export async function createComment(postId: string, value: string): Promise<CommentRecord> {
  const content = validateContent(value);
  const { data, error } = await requireClient()
    .from('comments')
    .insert({
      post_id: postId,
      author_name: 'Jon',
      author_avatar: '/assets/aistudio/image_d0e5de4a.png',
      content,
    })
    .select(COMMENT_COLUMNS)
    .single();

  if (error) throw new Error(error.message);
  return data as unknown as CommentRecord;
}

export async function changePostLike(postId: string, delta: 1 | -1): Promise<number> {
  const { data, error } = await requireClient().rpc('change_post_likes', {
    p_post_id: postId,
    p_delta: delta,
  });
  if (error) throw new Error(error.message);
  return data as number;
}

export async function changeCommentLike(commentId: string, delta: 1 | -1): Promise<number> {
  const { data, error } = await requireClient().rpc('change_comment_likes', {
    p_comment_id: commentId,
    p_delta: delta,
  });
  if (error) throw new Error(error.message);
  return data as number;
}
