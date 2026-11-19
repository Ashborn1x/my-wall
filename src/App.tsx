'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileSidebar } from './components/ProfileSidebar';
import { ProfileSubViews } from './components/ProfileSubViews';
import { SponsoredSidebar } from './components/SponsoredSidebar';
import { TopNavigation } from './components/TopNavigation';
import { WallComposer } from './components/WallComposer';
import { WallFeed } from './components/WallFeed';
import { INITIAL_FRIENDS, JON_AVATAR, SPONSORED_ADS } from './data/initialWallData';
import { getSupabaseClient } from './lib/supabase/client';
import {
  changeCommentLike,
  changePostLike,
  createComment,
  createPost,
  fetchLatestPosts,
  type CommentRecord,
  type PostRecord,
} from './lib/supabase/posts';
import {
  ActivityFilter,
  LinkAttachment,
  PrivacyOption,
  ProfileTab,
  WallPostItem,
} from './types/wall';

function formatWallTimestamp(value: string): string {
  const date = new Date(value);
  const day = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  const time = date.toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit',
  }).toLowerCase().replace(/\s+/g, '');
  return `${day} at ${time}`;
}

function toWallPost(record: PostRecord): WallPostItem {
  return {
    id: record.id,
    authorName: record.author_name,
    authorAvatar: record.author_avatar,
    content: record.content,
    createdAt: record.created_at,
    timestamp: formatWallTimestamp(record.created_at),
    category: record.category,
    privacy: record.privacy ?? undefined,
    likes: record.likes,
    likedByMe: false,
    showWallToWall: record.show_wall_to_wall,
    album: record.album ?? undefined,
    linkAttachment: record.link_attachment ?? undefined,
    photoAttachment: record.photo_attachment ?? undefined,
    comments: (record.comments ?? []).map(toWallComment),
  };
}

function toWallComment(record: CommentRecord) {
  return {
    id: record.id,
    authorName: record.author_name,
    authorAvatar: record.author_avatar || JON_AVATAR,
    content: record.content,
    timestamp: formatWallTimestamp(record.created_at),
    likes: record.likes,
    likedByMe: false,
  };
}

function mergePosts(current: WallPostItem[], incoming: WallPostItem[]): WallPostItem[] {
  const postsById = new Map(current.map((post) => [post.id, post]));
  incoming.forEach((post) => postsById.set(post.id, post));
  return Array.from(postsById.values())
    .sort((a, b) => Date.parse(b.createdAt ?? '') - Date.parse(a.createdAt ?? ''))
    .slice(0, 50);
}

export default function App() {
  const [posts, setPosts] = useState<WallPostItem[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [postsError, setPostsError] = useState('');
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    let isActive = true;
    const supabase = getSupabaseClient();

    if (!supabase) {
      setPostsError('Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.');
      setIsLoadingPosts(false);
      return () => { isActive = false; };
    }

    setIsLoadingPosts(true);
    setPostsError('');
    const channel = supabase
      .channel('public-posts-feed')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, (payload) => {
        if (!isActive) return;
        setPosts((current) => mergePosts(current, [toWallPost(payload.new as PostRecord)]));
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'posts' }, (payload) => {
        if (!isActive) return;
        const updated = payload.new as PostRecord;
        setPosts((current) => current.map((post) =>
          post.id === updated.id ? { ...post, likes: updated.likes } : post
        ));
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments' }, (payload) => {
        if (!isActive) return;
        const comment = toWallComment(payload.new as CommentRecord);
        const postId = (payload.new as CommentRecord).post_id;
        setPosts((current) => current.map((post) => post.id !== postId || post.comments.some((item) => item.id === comment.id)
          ? post
          : { ...post, comments: [...post.comments, comment] }
        ));
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'comments' }, (payload) => {
        if (!isActive) return;
        const updated = payload.new as CommentRecord;
        setPosts((current) => current.map((post) => ({
          ...post,
          comments: post.comments.map((comment) => comment.id === updated.id
            ? { ...comment, likes: updated.likes }
            : comment
          ),
        })));
      })
      .subscribe();

    fetchLatestPosts()
      .then((records) => {
        if (isActive) setPosts((current) => mergePosts(current, records.map(toWallPost)));
      })
      .catch((error: unknown) => {
        if (isActive) setPostsError(error instanceof Error ? error.message : 'Could not load wall posts.');
      })
      .finally(() => {
        if (isActive) setIsLoadingPosts(false);
      });

    return () => {
      isActive = false;
      void supabase.removeChannel(channel);
    };
  }, [loadAttempt]);

  const [activeTab, setActiveTab] = useState<ProfileTab>('wall');
  const [activeFilter, setActiveFilter] = useState<ActivityFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const composerRef = useRef<HTMLTextAreaElement | null>(null);
  const friendsSectionRef = useRef<HTMLDivElement | null>(null);

  const handlePublishPost = async (payload: {
    content: string;
    privacy: PrivacyOption;
    linkAttachment?: LinkAttachment;
    photoAttachment?: string;
  }) => {
    const record = await createPost(payload);
    setPosts((current) => mergePosts(current, [toWallPost(record)]));
    setActiveTab('wall');
    setActiveFilter('all');
    setSearchQuery('');
  };

  const handleToggleLikePost = async (postId: string) => {
    const post = posts.find((item) => item.id === postId);
    if (!post) return;
    const nextLiked = !post.likedByMe;
    const likes = await changePostLike(postId, nextLiked ? 1 : -1);
    setPosts((current) => current.map((item) => item.id === postId
      ? { ...item, likedByMe: nextLiked, likes }
      : item
    ));
  };

  const handleAddComment = async (postId: string, content: string) => {
    const record = await createComment(postId, content);
    const comment = toWallComment(record);
    setPosts((current) => current.map((post) => post.id !== postId || post.comments.some((item) => item.id === comment.id)
      ? post
      : { ...post, comments: [...post.comments, comment] }
    ));
  };

  const handleToggleLikeComment = async (postId: string, commentId: string) => {
    const post = posts.find((item) => item.id === postId);
    const comment = post?.comments.find((item) => item.id === commentId);
    if (!comment) return;
    const nextLiked = !comment.likedByMe;
    const likes = await changeCommentLike(commentId, nextLiked ? 1 : -1);
    setPosts((current) => current.map((item) => item.id !== postId ? item : {
      ...item,
      comments: item.comments.map((entry) => entry.id === commentId
        ? { ...entry, likedByMe: nextLiked, likes }
        : entry
      ),
    }));
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
                  isLoading={isLoadingPosts}
                  loadError={postsError}
                  onRetry={() => setLoadAttempt((attempt) => attempt + 1)}
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
