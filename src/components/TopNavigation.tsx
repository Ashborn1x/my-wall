import React, { useState } from 'react';
import { JON_AVATAR } from '../data/initialWallData';
import { ProfileTab } from '../types/wall';
import { SafeImage } from './SafeImage';

interface TopNavigationProps {
  activeTab: ProfileTab;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSelectTab: (tab: ProfileTab) => void;
  onScrollToFriends: () => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  activeTab,
  searchQuery,
  onSearchChange,
  onSelectTab,
  onScrollToFriends,
}) => {
  const [inboxOpen, setInboxOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  const handleOpenInbox = (e: React.MouseEvent) => {
    e.preventDefault();
    setInboxOpen((prev) => !prev);
    if (unreadCount > 0) {
      setUnreadCount(0);
    }
  };

  return (
    <header
      className="bg-[#3b5998] w-full border-b border-[#29447e] min-h-[38px] flex items-center justify-center px-3 sm:px-4 sticky top-0 z-50 shadow-sm"
      data-purpose="global-header"
    >
      <div className="w-full max-w-[1020px] flex items-center justify-between gap-3 py-1">
        {/* Brand Logo & Left Main Navigation */}
        <div className="flex items-center gap-4 sm:gap-6 min-w-0">
          <a
            href="#wall"
            onClick={(e) => {
              e.preventDefault();
              onSelectTab('wall');
              onSearchChange('');
            }}
            className="text-white font-black text-xl sm:text-2xl tracking-tighter hover:no-underline font-sans pb-0.5 whitespace-nowrap shrink-0"
            title="My Wall home"
          >
            My Wall
          </a>

          <nav className="flex items-center space-x-2.5 sm:space-x-3 text-[11px] text-white overflow-x-auto">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                onSelectTab('wall');
                onSearchChange('');
              }}
              className="text-white hover:underline font-normal whitespace-nowrap shrink-0"
            >
              Home
            </a>
            <a
              href="#profile"
              onClick={(e) => {
                e.preventDefault();
                onSelectTab('info');
              }}
              className={`text-white hover:underline whitespace-nowrap shrink-0 ${
                activeTab === 'info' ? 'font-bold' : 'font-normal'
              }`}
            >
              My Profile
            </a>
            <a
              href="#wall"
              onClick={(e) => {
                e.preventDefault();
                onSelectTab('wall');
              }}
              className={`text-white hover:underline whitespace-nowrap shrink-0 ${
                activeTab === 'wall' ? 'font-bold' : 'font-normal'
              }`}
            >
              Wall
            </a>
            <a
              href="#friends"
              onClick={(e) => {
                e.preventDefault();
                onScrollToFriends();
              }}
              className="hidden sm:inline text-white hover:underline font-normal whitespace-nowrap shrink-0"
            >
              Friends
            </a>
            <div className="relative hidden sm:block shrink-0">
              <a
                href="#inbox"
                onClick={handleOpenInbox}
                className="text-white hover:underline flex items-center gap-1 font-normal whitespace-nowrap shrink-0"
              >
                Inbox
                {unreadCount > 0 && (
                  <span className="bg-red-600 text-white font-bold px-1 rounded-sm text-[10px] leading-tight">
                    {unreadCount}
                  </span>
                )}
              </a>

              {inboxOpen && (
                <div className="absolute left-0 top-7 w-64 bg-white border border-[#3b5998] shadow-md text-[#333333] z-50">
                  <div className="bg-[#eceff5] border-b border-[#d8dfea] px-2.5 py-1.5 flex items-center justify-between font-bold text-[11px] text-[#3b5998]">
                    <span>Inbox Messages</span>
                    <button
                      type="button"
                      onClick={() => setInboxOpen(false)}
                      className="text-gray-500 hover:text-black font-normal text-xs cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                  <div className="divide-y divide-[#e9e9e9] text-[11px]">
                    <div className="p-2 hover:bg-[#eceff5]">
                      <div className="font-bold text-[#3b5998]">Priscilla Chan</div>
                      <div className="text-gray-700 truncate">Hey! Are you heading to campus later?</div>
                      <div className="text-[10px] text-gray-400">Sat at 10:48am</div>
                    </div>
                    <div className="p-2 hover:bg-[#eceff5]">
                      <div className="font-bold text-[#3b5998]">Robert Scoble</div>
                      <div className="text-gray-700 truncate">Just uploaded the headquarters photowalk!</div>
                      <div className="text-[10px] text-gray-400">June 3 at 12:05am</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right User Profile Area & Vintage Search Bar */}
        <div className="flex items-center space-x-2.5 sm:space-x-3 text-[11px] shrink-0">
          <div className="hidden md:flex items-center space-x-2 text-white/90">
            <a
              href="#wall"
              onClick={(e) => {
                e.preventDefault();
                onSelectTab('wall');
              }}
              className="flex items-center gap-1.5 text-white font-semibold hover:underline whitespace-nowrap"
            >
              <SafeImage
                src={JON_AVATAR}
                alt="Jon Doe"
                className="w-5 h-5 object-cover border border-[#29447e] bg-white"
              />
              <span>Jon Doe</span>
            </a>
            <span className="text-blue-200">|</span>
            <a
              href="#info"
              onClick={(e) => {
                e.preventDefault();
                onSelectTab('info');
              }}
              className="text-white hover:underline whitespace-nowrap"
            >
              Info
            </a>
          </div>

          {/* Search input box */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="relative flex items-center"
            data-purpose="site-search"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search"
              aria-label="Search wall posts"
              className="h-[22px] w-28 sm:w-44 text-[11px] px-2 pr-6 border border-gray-400 focus:outline-none rounded-none text-black bg-white"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                title="Clear search"
                className="absolute right-0 top-0 h-[22px] w-6 bg-[#d8dfea] border border-[#a0a9b8] border-l-0 flex items-center justify-center text-[#3b5998] hover:bg-white cursor-pointer font-bold text-xs"
              >
                ×
              </button>
            ) : (
              <button
                type="submit"
                title="Search"
                className="absolute right-0 top-0 h-[22px] w-6 bg-[#d8dfea] border border-[#a0a9b8] border-l-0 flex items-center justify-center text-[#3b5998] hover:bg-white cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path
                    clipRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    fillRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </form>
        </div>
      </div>
    </header>
  );
};
