import React, { useState } from 'react';
import { ActivityFilter, WallPostItem } from '../types/wall';
import { WallPost } from './WallPost';

interface WallFeedProps {
  posts: WallPostItem[];
  activeFilter: ActivityFilter;
  searchQuery: string;
  onFilterChange: (filter: ActivityFilter) => void;
  onToggleLikePost: (postId: string) => void;
  onAddComment: (postId: string, content: string) => void;
  onToggleLikeComment: (postId: string, commentId: string) => void;
  onClearSearch: () => void;
}

const FILTER_LABELS: Record<ActivityFilter, string> = {
  all: 'All Activity',
  status: 'Status Updates',
  photos: 'Photos',
  wall: 'Wall-to-Wall',
};

export const WallFeed: React.FC<WallFeedProps> = ({
  posts,
  activeFilter,
  searchQuery,
  onFilterChange,
  onToggleLikePost,
  onAddComment,
  onToggleLikeComment,
  onClearSearch,
}) => {
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  return (
    <div>
      {/* Recent Activity Filter Row */}
      <div className="flex items-center justify-between border-b border-[#cccccc] pb-1 mb-3 text-xs relative">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-500 tracking-wider text-[10px] uppercase">
            Recent Activity
          </span>
          {activeFilter !== 'all' && (
            <button
              type="button"
              onClick={() => onFilterChange('all')}
              className="text-[10px] text-[#3b5998] hover:underline cursor-pointer"
            >
              ({FILTER_LABELS[activeFilter]} — Show All)
            </button>
          )}
          {searchQuery && (
            <button
              type="button"
              onClick={onClearSearch}
              className="text-[10px] text-[#3b5998] hover:underline cursor-pointer"
            >
              (Search: &ldquo;{searchQuery}&rdquo; ×)
            </button>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setFilterMenuOpen((prev) => !prev)}
            className="text-[#3b5998] hover:underline flex items-center gap-0.5 text-[11px] cursor-pointer"
          >
            Filters <span className="text-[9px]">▼</span>
          </button>

          {filterMenuOpen && (
            <div className="absolute right-0 mt-1 w-36 bg-white border border-[#3b5998] shadow-md z-20 py-0.5">
              {(Object.keys(FILTER_LABELS) as ActivityFilter[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    onFilterChange(key);
                    setFilterMenuOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1 text-[11px] cursor-pointer block ${
                    activeFilter === key
                      ? 'bg-[#3b5998] text-white font-bold'
                      : 'text-[#333333] hover:bg-[#eceff5]'
                  }`}
                >
                  {FILTER_LABELS[key]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mini Activity Items */}
      {activeFilter === 'all' && !searchQuery && (
        <div className="text-[11px] text-gray-600 mb-3 space-y-1 pl-1">
          <div className="flex items-center space-x-1.5">
            <span className="text-blue-700 text-xs" aria-hidden="true">
              📷
            </span>
            <span>
              <a
                href="#profile"
                onClick={(e) => e.preventDefault()}
                className="font-bold"
              >
                Jon
              </a>{' '}
              likes{' '}
              <a href="#photo" onClick={(e) => e.preventDefault()}>
                Nick Schrock&apos;s
              </a>{' '}
              photo.
            </span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-blue-700 text-xs" aria-hidden="true">
              👥
            </span>
            <span>
              <a
                href="#profile"
                onClick={(e) => e.preventDefault()}
                className="font-bold"
              >
                Jon
              </a>{' '}
              joined the group{' '}
              <a href="#group" onClick={(e) => e.preventDefault()}>
                Web Developers 2008
              </a>
              .
            </span>
          </div>
        </div>
      )}

      {/* Feed Stream */}
      {posts.length === 0 ? (
        <div className="border-t border-[#e9e9e9] pt-4 text-center text-gray-500 text-xs py-8">
          No wall posts match your current filter.
        </div>
      ) : (
        <div
          className="space-y-4"
          data-purpose="wall-feed-posts"
          id="wallFeedStream"
        >
          {posts.map((post) => (
            <WallPost
              key={post.id}
              post={post}
              onToggleLikePost={onToggleLikePost}
              onAddComment={onAddComment}
              onToggleLikeComment={onToggleLikeComment}
              onFilterWallToWall={() => onFilterChange('wall')}
            />
          ))}
        </div>
      )}
    </div>
  );
};
