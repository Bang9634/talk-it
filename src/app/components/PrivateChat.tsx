import { useState, useEffect, useRef } from 'react';
import { User, Message, PrivateRoom } from '../types';
import { sendPrivateMessage, getPrivateMessages, getUserPrivateRooms } from '../api/mockApi';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Send, ArrowLeft, Lock, Users, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '../i18n/LanguageContext';

interface PrivateChatProps {
  user: User;
  roomId: string;
  onNavigate: (page: string) => void;
}

export function PrivateChat({ user, roomId, onNavigate }: PrivateChatProps) {
  const [room, setRoom] = useState<PrivateRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    loadRoomInfo();
    loadMessages();

    // 실시간 메시지 시뮬레이션
    const interval = setInterval(() => {
      // 가끔 다른 사용자의 메시지 추가 (데모용)
      if (Math.random() > 0.97 && room) {
        const otherUsernames = ['Alice', 'Bob', 'Charlie', 'David'];
        const randomUsername = otherUsernames[Math.floor(Math.random() * otherUsernames.length)];
        const demoMessages = [
          '안녕하세요!',
          '좋은 아이디어네요',
          '동의합니다',
          '감사합니다',
        ];
        const demoMessage: Message = {
          id: `msg-${Date.now()}-${Math.random()}`,
          content: demoMessages[Math.floor(Math.random() * demoMessages.length)],
          timestamp: new Date().toISOString(),
          userId: `other-${Math.random()}`,
          username: randomUsername,
        };
        setMessages(prev => [...prev, demoMessage]);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [roomId, room]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadRoomInfo = async () => {
    try {
      const rooms = await getUserPrivateRooms(user.id);
      const currentRoom = rooms.find(r => r.id === roomId);
      if (currentRoom) {
        setRoom(currentRoom);
      }
    } catch (error) {
      console.error('방 정보 로드 실패:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const msgs = await getPrivateMessages(roomId);
      setMessages(msgs);
    } catch (error) {
      console.error('메시지 로드 실패:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setLoading(true);
    try {
      const message = await sendPrivateMessage(roomId, inputMessage, user);
      setMessages(prev => [...prev, message]);
      setInputMessage('');
    } catch (error) {
      console.error('메시지 전송 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  };

  const copyInviteCode = () => {
    if (room) {
      navigator.clipboard.writeText(room.inviteCode);
      toast.success(t('inviteCodeCopied'));
    }
  };

  if (!room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="p-6">
          <p>{t('roomNotFound')}</p>
          <Button onClick={() => onNavigate('private-rooms')} className="mt-4">
            {t('backToRoomList')}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 헤더 */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('private-rooms')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="bg-purple-600 text-white p-2 rounded-lg">
                  <Lock className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl">{room.name}</h1>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Users className="h-3 w-3" />
                    {room.members.length} {t('members')}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 bg-gray-50 p-2 rounded-md text-sm">
              <span className="text-gray-600">{t('inviteCode')}:</span>{' '}
              <span className="font-mono font-semibold">{room.inviteCode}</span>
            </div>
            <Button variant="outline" size="sm" onClick={copyInviteCode}>
              <Copy className="h-4 w-4 mr-2" />
              {t('copy')}
            </Button>
          </div>
        </div>
      </div>

      {/* 채팅 영역 */}
      <div className="max-w-6xl mx-auto p-4">
        <Card className="h-[calc(100vh-220px)] flex flex-col">
          {/* 메시지 목록 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-10">
                <Lock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>{t('noMessages')}</p>
                <p className="text-sm">{t('firstMessage')}</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMyMessage = msg.userId === user.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] ${
                        isMyMessage
                          ? 'bg-purple-600 text-white'
                          : 'bg-white border'
                      } rounded-lg p-3 shadow-sm`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold">
                          {msg.username}
                        </span>
                        <span
                          className={`text-xs ${
                            isMyMessage ? 'text-purple-100' : 'text-gray-500'
                          }`}
                        >
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                      <p className="break-words">{msg.content}</p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 입력 영역 */}
          <div className="p-4 border-t bg-gray-50">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={t('messagePlaceholder')}
                disabled={loading}
                className="flex-1"
              />
              <Button type="submit" disabled={loading || !inputMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}