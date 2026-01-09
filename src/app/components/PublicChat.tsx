import { useState, useEffect, useRef } from 'react';
import { User, ChatMessage, AnonymousUser } from '../types';
import { sendPublicMessage, getPublicMessages, generateAnonymousUser } from '../api/mockApi';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Send, User as UserIcon, Users, LogOut, UserCircle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

interface PublicChatProps {
  user: User | null;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function PublicChat({ user, onNavigate, onLogout }: PublicChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [anonymousUser, setAnonymousUser] = useState<AnonymousUser | null>(null);
  const [anonymousName, setAnonymousName] = useState('');
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const { t } = useLanguage();

  // 익명 사용자 생성 (한 번만 실행)
  useEffect(() => {
    if (!user && !anonymousUser) {
      const newAnonymousUser = generateAnonymousUser();
      setAnonymousUser(newAnonymousUser);
      setAnonymousName(newAnonymousUser.name);
    }
  }, [user, anonymousUser]);

  // WebSocket 연결 (user가 변경될 때만 재연결)
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080/chat');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      setConnectionStatus('connected');
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(`📨 [${data.type}] ${data.username || data.anonymousUser?.name || ''}: ${data.content}`);

        // 메시지 타입 처리
        if (data.type === 'CHAT') {
          const newMessage: ChatMessage = {
            messageId: data.id || `msg-${Date.now()}-${Math.random()}`,
            content: data.content,
            timestamp: data.timestamp || new Date().toISOString(),
            userId: data.userId,
            username: data.username,
            type: data.type
          };
          setMessages(prev => [...prev, newMessage]);
        } else if (data.type === 'error') {
          console.error('❌ 서버 에러:', data.message);
          alert(data.message);
        } else if (data.type === 'history') {
          // 초기 메시지 히스토리
          setMessages(data.messages || []);
        }
      } catch (error) {
        console.error('메시지 파싱 실패:', error);
      }
    };
  
    ws.onerror = (error) => {
      console.error('❌ WebSocket 에러:', error);
      setConnectionStatus('disconnected');
    };

    ws.onclose = () => {
      console.log('🔌 WebSocket 연결 종료');
      setConnectionStatus('disconnected');
    };

    // 정리
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    try {
      const msgs = await getPublicMessages();
      setMessages(msgs);
    } catch (error) {
      console.error('메시지 로드 실패:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    setLoading(true);
    try {
      const messageData = {
        content: inputMessage,
        userId: user?.id,
        username: user?.username,
        anonymousUser: !user ? {
          ...anonymousUser,
          name: anonymousName.trim() || anonymousUser?.name
        } : undefined,
      };

      wsRef.current.send(JSON.stringify(messageData));
      setInputMessage('');
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      alert('메시지 전송에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 헤더 */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl">{t('publicChatTitle')}</h1>
              <p className="text-sm text-gray-600">
                {t('publicChatDescription')}
                <span className={`ml-2 text-xs ${
                  connectionStatus === 'connected' ? 'text-green-600' : 
                  connectionStatus === 'connecting' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {connectionStatus === 'connected' ? '● 연결됨' :
                   connectionStatus === 'connecting' ? '● 연결 중...' : '● 연결 끊김'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Button variant="outline" onClick={() => onNavigate('profile')}>
                  <UserCircle className="h-4 w-4 mr-2" />
                  {user.username}
                </Button>
                <Button variant="outline" onClick={() => onNavigate('private-rooms')}>
                  {t('privateRooms')}
                </Button>
                <Button variant="ghost" onClick={onLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button onClick={() => onNavigate('login')}>
                {t('login')}
              </Button>
            )}
            <LanguageSelector />
          </div>
        </div>
      </div>

      {/* 채팅 영역 */}
      <div className="max-w-6xl mx-auto p-4">
        <Card className="h-[calc(100vh-180px)] flex flex-col">
          {/* 현재 사용자 정보 */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center gap-2 text-sm">
              <UserIcon className="h-4 w-4 text-gray-600" />
              {user ? (
                <span>
                  <span className="text-green-600 mr-2">●</span>
                  <strong>{user.username}</strong> ({t('loggedInUser')})
                </span>
              ) : (
                <span>
                  <span className="text-blue-600 mr-2">●</span>
                  <strong>{anonymousName || anonymousUser?.name}</strong> ({t('anonymous')}, {anonymousUser?.ipHash})
                </span>
              )}
            </div>
          </div>

          {/* 메시지 목록 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-10">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>{t('noMessages')}</p>
                <p className="text-sm">{t('firstMessage')}</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMyMessage = user
                return (
                  <div
                    key={msg.messageId}
                    className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] ${
                        isMyMessage
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border'
                      } rounded-lg p-3 shadow-sm`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        (
                          <span className="text-xs font-semibold">
                            {msg.username}
                          </span>
                        )
                        <span
                          className={`text-xs ${
                            isMyMessage ? 'text-blue-100' : 'text-gray-500'
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
              {!user && (
                <Input
                  value={anonymousName}
                  onChange={(e) => setAnonymousName(e.target.value)}
                  placeholder={t('namePlaceholder')}
                  className="w-32"
                />
              )}
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={t('messagePlaceholder')}
                disabled={loading}
                className="flex-1"
              />
              <Button 
                type="submit" 
                disabled={loading || !inputMessage.trim() || connectionStatus !== 'connected'}
                >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}