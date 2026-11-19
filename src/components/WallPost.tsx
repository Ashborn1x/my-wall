import React, { useState } from 'react';
import { JON_AVATAR } from '../data/initialWallData';
import { WallPostItem } from '../types/wall';
import { SafeImage } from './SafeImage';

interface WallPostProps {
  post: WallPostItem;
  onToggleLikePost: (postId: string) => Promise<void>;
  onAddComment: (postId: string, content: string) => Promise<void>;
  onToggleLikeComment: (postId: string, commentId: string) => Promise<void>;
  onFilterWallToWall?: () => void;
}

export const WallPost: React.FC<WallPostProps> = ({
  post,
  onToggleLikePost,
  onAddComment,
  onToggleLikeComment,
  onFilterWallToWall,
}) => {
  const [commentText, setCommentText] = useState('');
  const [actionError, setActionError] = useState('');
  const [commentBoxOpen, setCommentBoxOpen] = useState(
    post.comments.length > 0
  );

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = commentText.trim();
    if (!trimmed) return;
    setActionError('');
    try {
      await onAddComment(post.id, trimmed);
      setCommentText('');
      setCommentBoxOpen(true);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Could not save your comment.');
    }
  };

  const handlePostLike = async () => {
    setActionError('');
    try {
      await onToggleLikePost(post.id);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Could not save your like.');
    }
  };

  const handleCommentLike = async (commentId: string) => {
    setActionError('');
    try {
      await onToggleLikeComment(post.id, commentId);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Could not save your like.');
    }
  };

  const hasFeedbackBar =
    post.likes > 0 || post.comments.length > 0 || commentBoxOpen || Boolean(actionError);

  return (
    <article
      className="border-t border-[#e9e9e9] pt-3 flex space-x-2.5"
      data-purpose="feed-item"
    >
      <SafeImage
        src={post.authorAvatar}
        alt={post.authorName}
        className="w-10 h-10 object-cover border border-[#cccccc] flex-shrink-0"
      />

      <div className="flex-1 min-w-0 text-xs">
        {/* Post Header & Message */}
        <div className="leading-snug break-words">
          <a
            href="#profile"
            onClick={(e) => e.preventDefault()}
            className="font-bold text-[#3b5998] hover:underline"
          >
            {post.authorName}
          </a>
          {post.album?.taggedUser && (
            <span className="text-gray-500 text-[11px] ml-1">
              in these photos:{' '}
              <a
                href="#profile"
                onClick={(e) => e.preventDefault()}
                className="text-[#3b5998] hover:underline"
              >
                {post.album.taggedUser}
              </a>
            </span>
          )}
          {post.content && (
            <span className="text-gray-900 ml-1">{post.content}</span>
          )}
        </div>

        {/* Single Photo Attachment */}
        {post.photoAttachment && (
          <div className="my-2 bg-gray-50 p-1.5 border border-[#e0e0e0] inline-block">
            <SafeImage
              src={post.photoAttachment}
              alt="Attached photo"
              className="max-w-[240px] max-h-40 object-cover border border-gray-300"
            />
          </div>
        )}

        {/* Link Attachment */}
        {post.linkAttachment && (
          <div className="my-1.5 bg-[#f7f7f7] border border-[#d8dfea] px-2 py-1.5 text-[11px]">
            <span className="text-gray-500 mr-1">🔗</span>
            <a
              href={post.linkAttachment.url}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-[#3b5998] hover:underline break-all"
            >
              {post.linkAttachment.label}
            </a>
          </div>
        )}

        {/* Album Photos Inline Grid */}
        {post.album && (
          <>
            <div className="grid grid-cols-3 gap-2 my-2 bg-gray-50 p-2 border border-[#e0e0e0]">
              {post.album.photos.map((photo, index) => (
                <SafeImage
                  key={`${post.id}-photo-${index}`}
                  src={photo}
                  alt={`${post.album?.title} ${index + 1}`}
                  className="w-full h-16 sm:h-20 object-cover border border-gray-300"
                />
              ))}
            </div>
            <div>
              <a
                href="#album"
                onClick={(e) => e.preventDefault()}
                className="font-bold text-[#3b5998] hover:underline"
              >
                {post.album.title}
              </a>
              <p className="text-gray-700 mt-1 leading-normal text-[11px]">
                {post.album.description}
              </p>
            </div>
          </>
        )}

        {/* Timestamp & Action Links */}
        <div className="text-[10px] text-gray-400 mt-1.5 flex flex-wrap items-center gap-x-1">
          <span>{post.timestamp}</span>
          {post.privacy && (
            <>
              <span>·</span>
              <span>{post.privacy}</span>
            </>
          )}
          <span>·</span>
          <button
            type="button"
            onClick={() => setCommentBoxOpen(true)}
            className="text-[#3b5998] hover:underline cursor-pointer"
          >
            Comment
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => void handlePostLike()}
            className="text-[#3b5998] hover:underline cursor-pointer"
          >
            {post.likedByMe ? 'Unlike' : 'Like'}
          </button>
          {post.showWallToWall && (
            <>
              <span>·</span>
              <button
                type="button"
                onClick={() => onFilterWallToWall?.()}
                className="text-[#3b5998] hover:underline cursor-pointer"
              >
                See Wall-to-Wall
              </button>
            </>
          )}
        </div>

        {/* Nested Feedback & Comment Box (Authentic 2008 #eceff5 style) */}
        {hasFeedbackBar && (
          <div className="mt-2 bg-[#eceff5] border-t border-[#d8dfea] p-2 space-y-2">
            {post.likes > 0 && (
              <div className="text-[11px] text-gray-700 border-b border-[#e0e5ef] pb-1.5 flex items-center gap-1">
                <span aria-hidden="true" className="text-[#3b5998]">
                  👍
                </span>
                <span>
                  {post.likedByMe
                    ? post.likes === 1
                      ? 'You like this.'
                      : `You and ${post.likes - 1} ${
                          post.likes - 1 === 1 ? 'other' : 'others'
                        } like this.`
                    : `${post.likes} ${
                        post.likes === 1 ? 'person likes' : 'people like'
                      } this.`}
                </span>
              </div>
            )}

            {post.comments.map((comment) => (
              <div
                key={comment.id}
                className="flex space-x-2 items-start border-b border-[#e0e5ef] pb-1.5 last:border-b-0 last:pb-0"
              >
                <SafeImage
                  src={comment.authorAvatar}
                  alt={comment.authorName}
                  className="w-6 h-6 object-cover border border-[#cccccc] flex-shrink-0"
                />
                <div className="text-[11px] leading-tight min-w-0 flex-1">
                  <div className="break-words">
                    <a
                      href="#profile"
                      onClick={(e) => e.preventDefault()}
                      className="font-bold text-[#3b5998] hover:underline"
                    >
                      {comment.authorName}
                    </a>
                    <span className="text-gray-800 ml-1">{comment.content}</span>
                  </div>
                  <div className="text-[9px] text-gray-400 mt-0.5 flex items-center gap-1">
                    <span>{comment.timestamp}</span>
                    <span>·</span>
                    <button
                      type="button"
                      onClick={() => void handleCommentLike(comment.id)}
                      className="text-[#3b5998] hover:underline cursor-pointer"
                    >
                      {comment.likedByMe ? 'Unlike' : 'Like'}
                    </button>
                    {comment.likes > 0 && (
                      <span className="text-gray-500 ml-0.5">
                        ({comment.likes})
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {commentBoxOpen && (
              <form onSubmit={handleCommentSubmit} className="pt-0.5 flex gap-1.5">
                <SafeImage
                  src={JON_AVATAR}
                  alt="Jon Doe"
                  className="w-6 h-6 object-cover border border-[#cccccc] flex-shrink-0 hidden sm:block"
                />
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  aria-label="Write a comment"
                  className="w-full bg-white border border-[#bdc7d8] px-2 py-1 text-[11px] focus:outline-none focus:border-[#3b5998]"
                />
              </form>
            )}
            {actionError && <p role="alert" className="text-[10px] text-red-700">{actionError}</p>}
          </div>
        )}
      </div>
    </article>
  );
};
