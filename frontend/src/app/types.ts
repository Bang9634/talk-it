// 사용자 타입
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

// 익명 사용자 타입
export interface AnonymousUser {
  id: string;
  name: string;
  ipHash: string;
}

// 메시지 타입
export interface ChatMessage {
  messageId?: string;
  userId?: string;
  username?: string;
  content: string;
  timestamp: string;
  type: string;
}

// 비공개 채팅방 타입
export interface PrivateRoom {
  id: string;
  name: string;
  inviteCode: string;
  inviteLink: string;
  createdBy: string;
  createdAt: string;
  members: string[];
}

// 인증 상태 타입
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  anonymousUser: AnonymousUser | null;
}

export interface OnlineUser {
  userId: string;
  username: string;
  maskedIp?: string;
  connectedAt: number;
  isAuthenticated: boolean;
}

export interface UserListResponse {
  type: 'USER_LIST';
  users: OnlineUser[];
  totalCount: number;
  timestamp: number;
}