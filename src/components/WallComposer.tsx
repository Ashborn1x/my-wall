import React, { useState } from 'react';
import { OFFICE_PHOTOS } from '../data/initialWallData';
import { LinkAttachment, PrivacyOption } from '../types/wall';

interface WallComposerProps {
  composerRef: React.RefObject<HTMLTextAreaElement | null>;
  onPublish: (payload: {
    content: string;
    privacy: PrivacyOption;
    linkAttachment?: LinkAttachment;
    photoAttachment?: string;
  }) => Promise<void>;
}

const MAX_CHARS = 280;

const PRIVACY_OPTIONS: PrivacyOption[] = [
  'Friends and Networks',
  'Everyone',
  'Only Friends',
  'Only Me',
];

export const WallComposer: React.FC<WallComposerProps> = ({
  composerRef,
  onPublish,
}) => {
  const [message, setMessage] = useState('');
  const [privacy, setPrivacy] = useState<PrivacyOption>('Friends and Networks');
  const [privacyMenuOpen, setPrivacyMenuOpen] = useState(false);
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(true);
  const [attachMode, setAttachMode] = useState<'none' | 'link' | 'photo'>('none');
  const [linkUrl, setLinkUrl] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<string>('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState('');

  const trimmedLength = Array.from(message.trim()).length;
  const charCount = Array.from(message).length;
  const isShareDisabled = trimmedLength === 0 || charCount > MAX_CHARS || isPublishing;

  const submitMessage = async () => {
    if (isShareDisabled) return;

    const cleanLink = linkUrl.trim();
    setIsPublishing(true);
    setPublishError('');
    try {
      await onPublish({
        content: message.trim(),
        privacy,
        linkAttachment:
          attachMode === 'link' && cleanLink
            ? {
                url: cleanLink.startsWith('http') ? cleanLink : `https://${cleanLink}`,
                label: cleanLink,
              }
            : undefined,
        photoAttachment:
          attachMode === 'photo' && selectedPhoto ? selectedPhoto : undefined,
      });

      setMessage('');
      setLinkUrl('');
      setSelectedPhoto('');
      setAttachMode('none');
    } catch (error) {
      setPublishError(error instanceof Error ? error.message : 'Could not publish your post. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submitMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && !isShareDisabled) {
      e.preventDefault();
      void submitMessage();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-[#b3b3b3] p-2 bg-[#f7f7f7] mb-4 relative"
      data-purpose="post-composer"
    >
      {/* Textarea */}
      <div className="bg-white border border-[#bdc7d8] focus-within:border-[#3b5998] p-1.5 mb-2 transition-colors">
        <textarea
          ref={composerRef}
          id="wallStatusInput"
          value={message}
          onChange={(e) => {
            const nextMessage = e.target.value;
            if (Array.from(nextMessage).length <= MAX_CHARS) setMessage(nextMessage);
          }}
          onKeyDown={handleKeyDown}
          maxLength={MAX_CHARS * 2}
          placeholder="What's on your mind?"
          rows={2}
          aria-label="What's on your mind?"
          className="w-full border-0 p-0 text-xs focus:ring-0 focus:outline-none resize-none text-gray-800 placeholder-gray-400 bg-white"
        />
      </div>

      {/* Optional Inline Attachment Panel */}
      {attachMode === 'link' && (
        <div className="mb-2 bg-white border border-[#d8dfea] p-1.5 flex items-center gap-2">
          <span className="text-[11px] font-bold text-[#3b5998] shrink-0">Link URL:</span>
          <input
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="http://example.com"
            className="flex-1 text-[11px] border border-[#bdc7d8] px-1.5 py-0.5 focus:outline-none focus:border-[#3b5998]"
          />
          <button
            type="button"
            onClick={() => {
              setAttachMode('none');
              setLinkUrl('');
            }}
            className="text-[11px] text-gray-500 hover:text-black cursor-pointer px-1"
          >
            Remove
          </button>
        </div>
      )}

      {attachMode === 'photo' && (
        <div className="mb-2 bg-white border border-[#d8dfea] p-1.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-[#3b5998]">
              Select a photo to attach:
            </span>
            <button
              type="button"
              onClick={() => {
                setAttachMode('none');
                setSelectedPhoto('');
              }}
              className="text-[11px] text-gray-500 hover:text-black cursor-pointer"
            >
              Cancel
            </button>
          </div>
          <div className="flex items-center gap-2">
            {OFFICE_PHOTOS.map((photo, idx) => (
              <button
                key={photo}
                type="button"
                onClick={() => setSelectedPhoto(photo)}
                className={`border p-0.5 cursor-pointer ${
                  selectedPhoto === photo
                    ? 'border-[#3b5998] bg-[#d8dfea]'
                    : 'border-[#cccccc] bg-white'
                }`}
              >
                <img
                  src={photo}
                  alt={`Album option ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-14 h-10 object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom controls bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Attachment Options */}
        <div className="flex items-center space-x-2 text-[11px] text-gray-600">
          <span className="font-semibold text-gray-500">Attach:</span>
          <button
            type="button"
            onClick={() =>
              setAttachMode((prev) => (prev === 'photo' ? 'none' : 'photo'))
            }
            className={`hover:underline flex items-center gap-1 cursor-pointer ${
              attachMode === 'photo'
                ? 'font-bold text-[#3b5998]'
                : 'text-gray-700 hover:text-[#3b5998]'
            }`}
            title="Attach Photo"
          >
            <span aria-hidden="true">📷</span>
            <span className="hidden sm:inline">Photo</span>
          </button>
          <button
            type="button"
            onClick={() =>
              setAttachMode((prev) => (prev === 'link' ? 'none' : 'link'))
            }
            className={`hover:underline flex items-center gap-1 cursor-pointer ${
              attachMode === 'link'
                ? 'font-bold text-[#3b5998]'
                : 'text-gray-700 hover:text-[#3b5998]'
            }`}
            title="Attach Link"
          >
            <span aria-hidden="true">🔗</span>
            <span className="hidden sm:inline">Link</span>
          </button>
        </div>

        {/* Character Counter, Privacy Selector & Submit Button */}
        <div className="flex items-center space-x-2 ml-auto">
          <span
            id="charCount"
            className={`text-[10px] tabular-nums ${
              charCount >= 260 ? 'text-amber-700 font-bold' : 'text-gray-500'
            }`}
          >
            {charCount}/{MAX_CHARS}
          </span>

          {/* Privacy Selector with retro padlock */}
          <div className="relative inline-block">
            <button
              type="button"
              onClick={() => setPrivacyMenuOpen((prev) => !prev)}
              className="text-[11px] bg-white border border-[#cccccc] px-2 py-0.5 text-gray-700 cursor-pointer rounded-sm hover:border-gray-400 flex items-center gap-1 whitespace-nowrap"
            >
              <span aria-hidden="true">🔒</span>
              <span>{privacy}</span>
              <span className="text-[9px]">▼</span>
            </button>

            {privacyMenuOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-white border border-[#3b5998] shadow-md z-30 py-0.5">
                {PRIVACY_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setPrivacy(option);
                      setPrivacyMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1 text-[11px] cursor-pointer block ${
                      privacy === option
                        ? 'bg-[#3b5998] text-white font-bold'
                        : 'text-[#333333] hover:bg-[#eceff5]'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Share Button */}
          <button
            id="shareBtn"
            type="submit"
            disabled={isShareDisabled}
            className="fb-btn-blue text-xs px-3 py-1 cursor-pointer whitespace-nowrap"
          >
            {isPublishing ? 'Sharing…' : 'Share'}
          </button>
        </div>
      </div>

      {publishError && (
        <p role="alert" className="mt-2 text-[11px] text-red-700">
          {publishError}
        </p>
      )}

      {/* 2008 Facebook "New Privacy Control" Tooltip Banner */}
      {showPrivacyNotice && (
        <div
          className="mt-2.5 p-2 pr-6 bg-[#f2f8eb] border border-[#89b657] text-[11px] leading-snug rounded-sm relative"
          data-purpose="privacy-notice"
        >
          <div className="tooltip-arrow-top" />
          <button
            type="button"
            onClick={() => setShowPrivacyNotice(false)}
            aria-label="Dismiss privacy notice"
            className="absolute top-1 right-1.5 text-gray-500 hover:text-black text-xs leading-none cursor-pointer"
          >
            ×
          </button>
          <strong className="text-green-900 block mb-0.5 font-bold">
            New Privacy Control
          </strong>
          <span className="text-gray-700">
            Use this new control to choose who can see each post you publish.{' '}
          </span>
          <a
            href="#privacy-info"
            onClick={(e) => {
              e.preventDefault();
              setPrivacyMenuOpen(true);
            }}
            className="text-[#3b5998] hover:underline"
          >
            Learn more...
          </a>
        </div>
      )}
    </form>
  );
};
