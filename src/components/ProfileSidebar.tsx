import React, { useState } from 'react';
import { JON_AVATAR } from '../data/initialWallData';
import { FriendItem, ProfileTab } from '../types/wall';
import { SafeImage } from './SafeImage';

interface ProfileSidebarProps {
  friends: FriendItem[];
  activeTab: ProfileTab;
  onSelectTab: (tab: ProfileTab) => void;
  onFocusComposer: () => void;
  friendsSectionRef: React.RefObject<HTMLDivElement | null>;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  friends,
  activeTab,
  onSelectTab,
  onFocusComposer,
  friendsSectionRef,
}) => {
  const [poked, setPoked] = useState(false);

  return (
    <aside
      className="w-full md:w-[195px] flex-shrink-0 text-[11px]"
      data-purpose="left-column-profile-info"
    >
      {/* Profile Picture + Mobile Identity Summary */}
      <div className="flex flex-row md:flex-col gap-3 md:gap-0 mb-3">
        <div className="border border-[#cccccc] p-1 bg-white md:mb-2 w-28 sm:w-36 md:w-full shrink-0">
          <SafeImage
            src={JON_AVATAR}
            alt="Jon Doe Profile"
            className="w-full h-auto aspect-square md:aspect-auto object-cover border border-[#e0e0e0] block"
          />
        </div>

        {/* Short profile description */}
        <div className="flex-1 md:border-b md:border-[#e5e5e5] md:pb-2.5 md:mb-2.5">
          <div className="font-bold text-[#1c2a47] text-xs mb-0.5">Jon</div>
          <p className="text-[11px] text-gray-600 leading-snug mb-2">
            Building early web apps in San Francisco. Coffee, code, and classic profiles.
          </p>
          {/* Small navigation links: Wall, Info, Photos */}
          <div className="flex flex-wrap md:flex-col gap-x-3 gap-y-1 text-[11px]">
            <a
              href="#wall"
              onClick={(e) => {
                e.preventDefault();
                onSelectTab('wall');
              }}
              className={`hover:underline ${
                activeTab === 'wall' ? 'font-bold text-[#1c2a47]' : 'text-[#3b5998]'
              }`}
            >
              Wall
            </a>
            <a
              href="#info"
              onClick={(e) => {
                e.preventDefault();
                onSelectTab('info');
              }}
              className={`hover:underline ${
                activeTab === 'info' ? 'font-bold text-[#1c2a47]' : 'text-[#3b5998]'
              }`}
            >
              Info
            </a>
            <a
              href="#photos"
              onClick={(e) => {
                e.preventDefault();
                onSelectTab('photos');
              }}
              className={`hover:underline ${
                activeTab === 'photos' ? 'font-bold text-[#1c2a47]' : 'text-[#3b5998]'
              }`}
            >
              Photos
            </a>
          </div>
        </div>
      </div>

      {/* Sidebar Action Links */}
      <ul className="hidden md:block space-y-1.5 pb-3.5 mb-3 border-b border-[#e5e5e5] text-[11px]">
        <li>
          <a
            href="#photos"
            onClick={(e) => {
              e.preventDefault();
              onSelectTab('photos');
            }}
            className="hover:underline"
          >
            View Photos of Jon (142)
          </a>
        </li>
        <li>
          <a
            href="#photos"
            onClick={(e) => {
              e.preventDefault();
              onSelectTab('photos');
            }}
            className="hover:underline"
          >
            View Videos of Jon (8)
          </a>
        </li>
        <li>
          <a
            href="#poke"
            onClick={(e) => {
              e.preventDefault();
              setPoked((prev) => !prev);
            }}
            className="hover:underline"
          >
            {poked ? 'You poked Jon!' : 'Poke Jon'}
          </a>
        </li>
        <li>
          <a
            href="#write-wall"
            onClick={(e) => {
              e.preventDefault();
              onSelectTab('wall');
              onFocusComposer();
            }}
            className="hover:underline"
          >
            Write on Jon&apos;s Wall
          </a>
        </li>
      </ul>

      {/* Information Summary Panel */}
      <div
        className="border border-[#d8dfea] mb-4 bg-white"
        data-purpose="info-panel"
      >
        <div className="fb-box-header flex items-center justify-between">
          <span>Information</span>
          <a
            href="#info"
            onClick={(e) => {
              e.preventDefault();
              onSelectTab('info');
            }}
            className="text-[10px] font-normal hover:underline"
          >
            Edit
          </a>
        </div>
        <div className="p-2 space-y-2 text-[11px] leading-tight">
          <div>
            <span className="text-gray-500 block">Networks:</span>
            <span className="font-normal text-[#3b5998] block">San Francisco, CA</span>
            <span className="block text-[#3b5998]">Harvard Alum</span>
          </div>
          <div>
            <span className="text-gray-500 block">Birthday:</span>
            <span>June 15, 1988</span>
          </div>
          <div>
            <span className="text-gray-500 block">Current City:</span>
            <span className="text-[#3b5998]">San Francisco, CA</span>
          </div>
          <div>
            <span className="text-gray-500 block">Relationship Status:</span>
            <span>In a Relationship</span>
          </div>
        </div>
      </div>

      {/* Friends List Box */}
      <div
        ref={friendsSectionRef}
        className="border border-[#d8dfea] mb-4 bg-white"
        data-purpose="mutual-friends-box"
      >
        <div className="fb-box-header flex justify-between items-center">
          <span>Friends</span>
          <span className="text-[10px] font-normal text-[#3b5998]">
            See All (348)
          </span>
        </div>
        <div className="p-2">
          <p className="text-[10px] text-gray-500 mb-2">287 friends in common</p>
          <div className="grid grid-cols-3 gap-1.5 text-center">
            {friends.map((friend) => (
              <div key={friend.id} className="flex flex-col items-center">
                <SafeImage
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-12 h-12 object-cover border border-[#cccccc] mb-1"
                />
                <span className="text-[10px] leading-3 text-[#3b5998] hover:underline truncate w-full cursor-pointer">
                  {friend.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
