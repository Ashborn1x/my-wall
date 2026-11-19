import { useEffect, useMemo, useRef, useState } from 'react';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileSidebar } from './components/ProfileSidebar';
import { ProfileSubViews } from './components/ProfileSubViews';
import { SponsoredSidebar } from './components/SponsoredSidebar';
import { TopNavigation } from './components/TopNavigation';
import { WallComposer } from './components/WallComposer';
import { WallFeed } from './components/WallFeed';
import {
  INITIAL_FRIENDS,
  INITIAL_POSTS,
  JON_AVATAR,
  SPONSORED_ADS,
} from './data/initialWallData';
import {
  ActivityFilter,
  LinkAttachment,
  PrivacyOption,
  ProfileTab,
  WallPostItem,
} from './types/wall';

const STORAGE_KEY = 'my_wall_posts_v1';

function formatCurrentTimestamp(): string {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
  return `Today at ${timeStr.toLowerCase().replace(/\s+/g, '')}`;
}

export default function App() {
  const [posts, setPosts] = useState<WallPostItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return (parsed as WallPostItem[]).map((post) => ({
            ...post,
            authorAvatar:
              post.authorName === 'Jon Doe' ? JON_AVATAR : post.authorAvatar,
            comments: (post.comments || []).map((comment) => ({
              ...comment,
              authorAvatar:
                comment.authorName === 'Jon Doe'
                  ? JON_AVATAR
                  : comment.authorAvatar,
            })),
          }));
        }
      }
    } catch {
      // Fallback to initial posts if storage is unavailable
    }
    return INITIAL_POSTS;
  });

  const [activeTab, setActiveTab] = useState<ProfileTab>('wall');
  const [activeFilter, setActiveFilter] = useState<ActivityFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const composerRef = useRef<HTMLTextAreaElement | null>(null);
  const friendsSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch {
      // Ignore storage quota errors
    }
  }, [posts]);

  const handlePublishPost = (payload: {
    content: string;
    privacy: PrivacyOption;
    linkAttachment?: LinkAttachment;
    photoAttachment?: string;
  }) => {
    const newPost: WallPostItem = {
      id: `post-${Date.now()}`,
      authorName: 'Jon Doe',
      authorAvatar: JON_AVATAR,
      content: payload.content,
      timestamp: formatCurrentTimestamp(),
      category: payload.photoAttachment ? 'photos' : 'status',
      privacy: payload.privacy,
      likes: 0,
      likedByMe: false,
      linkAttachment: payload.linkAttachment,
      photoAttachment: payload.photoAttachment,
      comments: [],
    };

    setPosts((prev) => [newPost, ...prev]);
    setActiveTab('wall');
    setActiveFilter('all');
    setSearchQuery('');
  };

  const handleToggleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const nextLiked = !post.likedByMe;
        return {
          ...post,
          likedByMe: nextLiked,
          likes: nextLiked ? post.likes + 1 : Math.max(0, post.likes - 1),
        };
      })
    );
  };

  const handleAddComment = (postId: string, content: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: `comment-${Date.now()}`,
              authorName: 'Jon Doe',
              authorAvatar: JON_AVATAR,
              content,
              timestamp: 'Just now',
              likes: 0,
              likedByMe: false,
            },
          ],
        };
      })
    );
  };

  const handleToggleLikeComment = (postId: string, commentId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments: post.comments.map((comment) => {
            if (comment.id !== commentId) return comment;
            const nextLiked = !comment.likedByMe;
            return {
              ...comment,
              likedByMe: nextLiked,
              likes: nextLiked
                ? comment.likes + 1
                : Math.max(0, comment.likes - 1),
            };
          }),
        };
      })
    );
  };

  const handleFocusComposer = () => {
    setActiveTab('wall');
    setTimeout(() => {
      composerRef.current?.focus();
    }, 0);
  };

  const handleScrollToFriends = () => {
    friendsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesFilter =
        activeFilter === 'all' || post.category === activeFilter;
      if (!matchesFilter) return false;
      if (!query) return true;

      const haystack = [
        post.authorName,
        post.content,
        post.album?.title || '',
        post.album?.description || '',
        ...post.comments.map((c) => `${c.authorName} ${c.content}`),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [posts, activeFilter, searchQuery]);

  return (
    <div className="bg-white min-h-screen text-[#333333] flex flex-col">
      <TopNavigation
        activeTab={activeTab}
        searchQuery={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          if (activeTab !== 'wall') setActiveTab('wall');
        }}
        onSelectTab={setActiveTab}
        onScrollToFriends={handleScrollToFriends}
      />

      <main className="w-full max-w-[1020px] mx-auto pt-4 px-3 sm:px-4 flex-1">
        <ProfileHeader
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          photoCount={142}
        />

        {/* 3-Column 2008 Layout */}
        <div className="flex flex-col md:flex-row gap-4 pt-3">
          <ProfileSidebar
            friends={INITIAL_FRIENDS}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            onFocusComposer={handleFocusComposer}
            friendsSectionRef={friendsSectionRef}
          />

          {/* Center Wall Content */}
          <section className="flex-1 min-w-0" data-purpose="center-feed">
            {activeTab === 'wall' ? (
              <>
                <WallComposer
                  composerRef={composerRef}
                  onPublish={handlePublishPost}
                />
                <WallFeed
                  posts={filteredPosts}
                  activeFilter={activeFilter}
                  searchQuery={searchQuery}
                  onFilterChange={setActiveFilter}
                  onToggleLikePost={handleToggleLikePost}
                  onAddComment={handleAddComment}
                  onToggleLikeComment={handleToggleLikeComment}
                  onClearSearch={() => setSearchQuery('')}
                />
              </>
            ) : (
              <ProfileSubViews
                tab={activeTab}
                onBackToWall={() => setActiveTab('wall')}
              />
            )}
          </section>

          <SponsoredSidebar ads={SPONSORED_ADS} />
        </div>
      </main>

      {/* Classic Footer */}
      <footer
        className="w-full max-w-[1020px] mx-auto mt-12 mb-8 pt-2 border-t border-[#cccccc] text-[11px] text-gray-500 px-3 sm:px-4"
        data-purpose="site-footer"
      >
        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-1 text-[#3b5998]">
          <a href="#about" onClick={(e) => e.preventDefault()} className="hover:underline">
            About
          </a>
          <a href="#advertising" onClick={(e) => e.preventDefault()} className="hover:underline">
            Advertising
          </a>
          <a href="#developers" onClick={(e) => e.preventDefault()} className="hover:underline">
            Developers
          </a>
          <a href="#careers" onClick={(e) => e.preventDefault()} className="hover:underline">
            Careers
          </a>
          <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:underline">
            Terms
          </a>
          <a href="#find-friends" onClick={(e) => e.preventDefault()} className="hover:underline">
            Find Friends
          </a>
          <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:underline">
            Privacy
          </a>
          <a href="#mobile" onClick={(e) => e.preventDefault()} className="hover:underline">
            Mobile
          </a>
          <a href="#help" onClick={(e) => e.preventDefault()} className="hover:underline">
            Help
          </a>
        </div>
        <p className="text-gray-400 text-[10px]">My Wall © 2009</p>
      </footer>
    </div>
  );
}
