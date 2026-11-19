export type ProfileTab = 'wall' | 'info' | 'photos' | 'notes' | 'boxes';

export type PrivacyOption =
  | 'Friends and Networks'
  | 'Everyone'
  | 'Only Friends'
  | 'Only Me';

export type ActivityFilter = 'all' | 'status' | 'photos' | 'wall';

export interface WallComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  likedByMe: boolean;
}

export interface AlbumAttachment {
  title: string;
  description: string;
  photos: string[];
  taggedUser?: string;
}

export interface LinkAttachment {
  url: string;
  label: string;
}

export interface WallPostItem {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  category: 'status' | 'photos' | 'wall';
  privacy?: PrivacyOption;
  likes: number;
  likedByMe: boolean;
  showWallToWall?: boolean;
  album?: AlbumAttachment;
  linkAttachment?: LinkAttachment;
  photoAttachment?: string;
  comments: WallComment[];
}

export interface FriendItem {
  id: string;
  name: string;
  avatar: string;
}

export interface SponsoredAdItem {
  id: string;
  title: string;
  image: string;
  description: string;
  ctaText?: string;
}
