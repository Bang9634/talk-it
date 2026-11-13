import { User, Message, PrivateRoom, AnonymousUser } from '../types';

// Mock 데이터 저장소
let mockUsers: User[] = [
  {
    id: '1',
    username: 'user1',
    email: 'user1@example.com',
    createdAt: new Date().toISOString(),
  },
];

let mockMessages: Message[] = [];
let mockPrivateRooms: PrivateRoom[] = [];

// 익명 사용자 생성
export function generateAnonymousUser(): AnonymousUser {
  const randomNames = ['Guest'];
  const name = `${randomNames[Math.floor(Math.random() * randomNames.length)]}${Math.floor(Math.random() * 9999)}`;
  const ipHash = `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.xxx.xxx`;
  
  return {
    id: `anon-${Date.now()}-${Math.random()}`,
    name,
    ipHash,
  };
}

// 로그인
export async function login(email: string, password: string): Promise<User> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find(u => u.email === email);
      if (user) {
        resolve(user);
      } else {
        reject(new Error('이메일 또는 비밀번호가 일치하지 않습니다.'));
      }
    }, 500);
  });
}

// 회원가입
export async function register(username: string, email: string, password: string): Promise<User> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const exists = mockUsers.find(u => u.email === email);
      if (exists) {
        reject(new Error('이미 존재하는 이메일입니다.'));
      } else {
        const newUser: User = {
          id: `user-${Date.now()}`,
          username,
          email,
          createdAt: new Date().toISOString(),
        };
        mockUsers.push(newUser);
        resolve(newUser);
      }
    }, 500);
  });
}

// 메시지 전송 (공개 채팅방)
export async function sendPublicMessage(content: string, user?: User, anonymousUser?: AnonymousUser): Promise<Message> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const message: Message = {
        id: `msg-${Date.now()}-${Math.random()}`,
        content,
        timestamp: new Date().toISOString(),
        userId: user?.id,
        username: user?.username,
        anonymousUser,
      };
      mockMessages.push(message);
      resolve(message);
    }, 200);
  });
}

// 공개 채팅방 메시지 가져오기
export async function getPublicMessages(): Promise<Message[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockMessages]);
    }, 200);
  });
}

// 비공개 방 생성
export async function createPrivateRoom(name: string, userId: string): Promise<PrivateRoom> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const room: PrivateRoom = {
        id: `room-${Date.now()}`,
        name,
        inviteCode,
        inviteLink: `https://talkit.example.com/room/${inviteCode}`,
        createdBy: userId,
        createdAt: new Date().toISOString(),
        members: [userId],
      };
      mockPrivateRooms.push(room);
      resolve(room);
    }, 300);
  });
}

// 비공개 방 참여 (초대 코드로)
export async function joinPrivateRoom(inviteCode: string, userId: string): Promise<PrivateRoom> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const room = mockPrivateRooms.find(r => r.inviteCode === inviteCode);
      if (room) {
        if (!room.members.includes(userId)) {
          room.members.push(userId);
        }
        resolve(room);
      } else {
        reject(new Error('존재하지 않는 초대 코드입니다.'));
      }
    }, 300);
  });
}

// 사용자의 비공개 방 목록 가져오기
export async function getUserPrivateRooms(userId: string): Promise<PrivateRoom[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const rooms = mockPrivateRooms.filter(r => r.members.includes(userId));
      resolve(rooms);
    }, 200);
  });
}

// 비공개 방 메시지 전송
export async function sendPrivateMessage(roomId: string, content: string, user: User): Promise<Message> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const message: Message = {
        id: `msg-${Date.now()}-${Math.random()}`,
        content,
        timestamp: new Date().toISOString(),
        userId: user.id,
        username: user.username,
      };
      resolve(message);
    }, 200);
  });
}

// 비공개 방 메시지 가져오기 (Mock)
export async function getPrivateMessages(roomId: string): Promise<Message[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock 데이터
      resolve([]);
    }, 200);
  });
}
