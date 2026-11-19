import React from 'react';
import { OFFICE_PHOTOS } from '../data/initialWallData';
import { ProfileTab } from '../types/wall';
import { SafeImage } from './SafeImage';

interface ProfileSubViewsProps {
  tab: Exclude<ProfileTab, 'wall'>;
  onBackToWall: () => void;
}

export const ProfileSubViews: React.FC<ProfileSubViewsProps> = ({
  tab,
  onBackToWall,
}) => {
  if (tab === 'info') {
    return (
      <div className="space-y-4">
        <div className="border border-[#d8dfea] bg-white">
          <div className="fb-box-header flex justify-between items-center">
            <span>Basic Information</span>
            <button
              type="button"
              onClick={onBackToWall}
              className="text-[10px] font-normal text-[#3b5998] hover:underline cursor-pointer"
            >
              Back to Wall
            </button>
          </div>
          <div className="p-3 text-[11px] space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <span className="text-gray-500">Networks:</span>
              <span className="col-span-2 text-[#3b5998]">
                San Francisco, CA · Harvard Alum
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-gray-500">Sex:</span>
              <span className="col-span-2">Male</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-gray-500">Birthday:</span>
              <span className="col-span-2">June 15, 1988</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-gray-500">Current City:</span>
              <span className="col-span-2 text-[#3b5998]">San Francisco, CA</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-gray-500">Relationship Status:</span>
              <span className="col-span-2">In a Relationship</span>
            </div>
          </div>
        </div>

        <div className="border border-[#d8dfea] bg-white">
          <div className="fb-box-header">Personal Information</div>
          <div className="p-3 text-[11px] space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <span className="text-gray-500">Activities:</span>
              <span className="col-span-2">
                Web engineering, open source software, photography walks
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-gray-500">Interests:</span>
              <span className="col-span-2">
                Distributed systems, classic web typography, retro UI design
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-gray-500">Favorite Music:</span>
              <span className="col-span-2">The Postal Service, Phoenix, Daft Punk</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (tab === 'photos') {
    return (
      <div className="border border-[#d8dfea] bg-white">
        <div className="fb-box-header flex justify-between items-center">
          <span>Jon&apos;s Photo Albums (142 Photos)</span>
          <button
            type="button"
            onClick={onBackToWall}
            className="text-[10px] font-normal text-[#3b5998] hover:underline cursor-pointer"
          >
            Back to Wall
          </button>
        </div>
        <div className="p-3">
          <p className="text-[11px] text-gray-600 mb-3">
            Album: <strong className="text-[#3b5998]">Photowalk around Facebook&apos;s new headquarters</strong>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {OFFICE_PHOTOS.map((src, i) => (
              <div key={src} className="border border-[#cccccc] p-1 bg-white">
                <SafeImage
                  src={src}
                  alt={`Office walk ${i + 1}`}
                  className="w-full h-28 object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (tab === 'notes') {
    return (
      <div className="border border-[#d8dfea] bg-white">
        <div className="fb-box-header flex justify-between items-center">
          <span>Jon&apos;s Notes</span>
          <button
            type="button"
            onClick={onBackToWall}
            className="text-[10px] font-normal text-[#3b5998] hover:underline cursor-pointer"
          >
            Back to Wall
          </button>
        </div>
        <div className="p-3 space-y-3 text-[11px]">
          <div className="border-b border-[#e9e9e9] pb-2">
            <div className="font-bold text-[#3b5998] text-xs mb-0.5">
              Why 2008 Social Feeds Felt So Personal
            </div>
            <div className="text-[10px] text-gray-400 mb-1">
              May 29, 2009 at 4:10pm
            </div>
            <p className="text-gray-700 leading-relaxed">
              No algorithmic clutter, just chronological updates from close friends, simple wall-to-wall notes, and clean blue-and-white hierarchy.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[#d8dfea] bg-white">
      <div className="fb-box-header flex justify-between items-center">
        <span>Boxes</span>
        <button
          type="button"
          onClick={onBackToWall}
          className="text-[10px] font-normal text-[#3b5998] hover:underline cursor-pointer"
        >
          Back to Wall
        </button>
      </div>
      <div className="p-3 text-[11px] text-gray-700">
        Jon&apos;s profile boxes include Groups (Web Developers 2008) and Shared Links.
      </div>
    </div>
  );
};
