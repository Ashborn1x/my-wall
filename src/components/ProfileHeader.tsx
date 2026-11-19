import React from 'react';
import { ProfileTab } from '../types/wall';

interface ProfileHeaderProps {
  activeTab: ProfileTab;
  onSelectTab: (tab: ProfileTab) => void;
  photoCount: number;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  activeTab,
  onSelectTab,
  photoCount,
}) => {
  const tabs: { id: ProfileTab; label: string }[] = [
    { id: 'wall', label: 'Wall' },
    { id: 'info', label: 'Info' },
    { id: 'photos', label: `Photos (${photoCount})` },
    { id: 'notes', label: 'Notes' },
    { id: 'boxes', label: 'Boxes' },
  ];

  return (
    <section
      className="border-b border-[#3b5998] mb-0 pb-0"
      data-purpose="profile-header"
    >
      <div className="flex items-baseline justify-between mb-2">
        <h1 className="text-xl sm:text-2xl font-bold text-[#1c2a47] leading-none">
          Jon Doe
        </h1>
      </div>

      {/* Authentic Navigation Tabs */}
      <div
        className="flex items-end space-x-0.5 sm:space-x-1 pl-1 overflow-x-auto"
        data-purpose="profile-tabs"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className={`fb-tab ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onSelectTab('boxes')}
          className="fb-tab text-gray-600 font-normal hover:text-black"
          title="More profile boxes"
        >
          +
        </button>
      </div>
    </section>
  );
};
