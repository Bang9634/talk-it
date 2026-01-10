import { useState, useEffect, useRef } from 'react';
import { User, ChatMessage, AnonymousUser, OnlineUser, UserListResponse } from '../types';
import { sendPublicMessage, getPublicMessages } from '../api/mockApi';
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
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [totalUserCount, setTotalUserCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const { t } = useLanguage();

  // WebSocket 연결 (한 번만 실행)
  useEffect(() => {
    // 이미 연결되어 있으면 중복 연결 방지
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log('✅ WebSocket 이미 연결됨 - 중복 연결 방지');
      return;
    }

    console.log('🔌 WebSocket 연결 시도...');
    const ws = new WebSocket('ws://localhost:8080/chat');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('✅ WebSocket 연결 성공');
      setConnectionStatus('connected');
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📦 서버로부터 받은 원본 데이터:', data);
        
        // USER_LIST 타입 처리 (온라인 사용자 목록 업데이트)
        if (data.type === 'USER_LIST') {
          console.log('👥 사용자 목록 업데이트:', data.totalCount, '명');
          setOnlineUsers(data.users || []);
          setTotalUserCount(data.totalCount || 0);
          return;
        }
        
        // 초기 히스토리인지 확인 (messages 배열이 있는 경우)
        if (data.messages && Array.isArray(data.messages)) {
          console.log('📜 초기 메시지 히스토리 수신:', data.messages.length, '개');
          setMessages(data.messages);
          return;
        }

        // 개별 메시지 처리
        if (data.type === 'CHAT') {
          console.log(`📨 [${data.type}] ${data.username || ''}: ${data.content || ''}`);
          const newMessage: ChatMessage = {
            messageId: data.messageId || data.id || `msg-${Date.now()}-${Math.random()}`,
            content: data.content,
            timestamp: data.timestamp || new Date().toISOString(),
            userId: data.userId,
            username: data.username,
            type: data.type
          };
        
          // 중복 체크 (서버의 messageId로 체크)
          setMessages(prev => {
            const isDuplicate = prev.some(msg => msg.messageId === newMessage.messageId);
            if (isDuplicate) {
              console.log('⚠️ 중복 메시지 무시:', newMessage.messageId);
              return prev;
            }
            console.log('✅ 새 메시지 추가:', newMessage.messageId);
            // timestamp 기준으로 정렬 (오래된 것 → 최신)
            return [...prev, newMessage].sort((a, b) => 
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            );
          });
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
      console.log('🧹 WebSocket 정리 중...');
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, []);

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
        <div className="h-[calc(100vh-180px)] flex gap-4">
          {/* 왼쪽: 채팅창 */}
          <Card className="flex-1 flex flex-col">
            {/* 현재 사용자 정보 */}
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center gap-2 text-sm">
                <UserIcon className="h-4 w-4 text-gray-600" />
                <span>
                  <span className="text-green-600 mr-2">●</span>
                  <strong>{user?.username}</strong>
                </span>
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
                  const isMyMessage = user ? msg.userId === user.id : false;
                  
                  // 시스템 메시지 타입별 스타일
                  const isSystemMessage = ['JOIN', 'LEAVE', 'SYSTEM'].includes(msg.type || '');
                  let systemMessageClass = '';
                  
                  if (msg.type === 'JOIN') {
                    systemMessageClass = 'bg-green-100 text-green-800 border-green-300';
                  } else if (msg.type === 'LEAVE') {
                    systemMessageClass = 'bg-red-100 text-red-800 border-red-300';
                  } else if (msg.type === 'SYSTEM') {
                    systemMessageClass = 'bg-gray-100 text-gray-800 border-gray-300';
                  }

                  return isSystemMessage ? (
                    <div key={msg.messageId} className="flex justify-center">
                      <div className={`max-w-[70%] ${systemMessageClass} rounded-lg px-4 py-2 shadow-sm text-center text-sm border`}>
                        <p className="break-words">{msg.content}</p>
                        <span className="text-xs opacity-70">
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                    </div>
                  ) : (
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
                          <span className="text-xs font-semibold">
                            {msg.username}
                          </span>
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

          {/* 오른쪽: 온라인 사용자 목록 */}
          <Card className="w-64 flex flex-col">
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-600" />
                <span className="font-semibold text-sm">온라인 ({totalUserCount})</span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3">
              {onlineUsers.length === 0 ? (
                <div className="text-center text-gray-400 text-sm mt-8">
                  접속 중인 사용자가 없습니다
                </div>
              ) : (
                <div className="space-y-2">
                  {onlineUsers.map((onlineUser) => (
                    <div 
                      key={onlineUser.userId}
                      className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-green-500 text-xs">●</span>
                      <span className={`text-sm ${onlineUser.userId === user?.id ? 'font-bold text-blue-600' : 'text-gray-700'}`}>
                        {onlineUser.username}
                        {onlineUser.userId === user?.id && ' (나)'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}