import { useState, useEffect } from 'react';
import { User, PrivateRoom } from '../types';
import { createPrivateRoom, joinPrivateRoom, getUserPrivateRooms } from '../api/mockApi';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ArrowLeft, Plus, Copy, Lock, Users, LogOut, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

interface PrivateRoomsProps {
  user: User;
  onNavigate: (page: string, roomId?: string) => void;
  onLogout: () => void;
}

export function PrivateRooms({ user, onNavigate, onLogout }: PrivateRoomsProps) {
  const [rooms, setRooms] = useState<PrivateRoom[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    loadRooms();
  }, [user]);

  const loadRooms = async () => {
    try {
      const userRooms = await getUserPrivateRooms(user.id);
      setRooms(userRooms);
    } catch (error) {
      console.error('방 목록 로드 실패:', error);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) return;

    setLoading(true);
    try {
      const room = await createPrivateRoom(roomName, user.id);
      setRooms(prev => [...prev, room]);
      setRoomName('');
      setShowCreateDialog(false);
      toast.success(t('roomCreated'));
    } catch (error) {
      console.error('방 생성 실패:', error);
      toast.error(t('createRoomError'));
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;

    setLoading(true);
    try {
      const room = await joinPrivateRoom(inviteCode, user.id);
      setRooms(prev => [...prev, room]);
      setInviteCode('');
      setShowJoinDialog(false);
      toast.success(t('roomJoined'));
    } catch (error) {
      console.error('방 참여 실패:', error);
      toast.error(t('joinRoomError'));
    } finally {
      setLoading(false);
    }
  };

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(t('inviteCodeCopied'));
  };

  const copyInviteLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success(t('inviteLinkCopied'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 헤더 */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('public-chat')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 text-white p-2 rounded-lg">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl">{t('privateRoomsTitle')}</h1>
                <p className="text-sm text-gray-600">{t('privateRoomsDescription')}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{user.username}</span>
            <LanguageSelector />
            <Button variant="ghost" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex gap-3 mb-6">
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                {t('createNewRoom')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('createRoomTitle')}</DialogTitle>
                <DialogDescription>
                  {t('createRoomDescription')}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateRoom} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="roomName">{t('roomName')}</Label>
                  <Input
                    id="roomName"
                    placeholder={t('roomNamePlaceholder')}
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t('creating') : t('createRoom')}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1">
                <Users className="h-4 w-4 mr-2" />
                {t('joinWithCode')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('joinRoomTitle')}</DialogTitle>
                <DialogDescription>
                  {t('joinRoomDescription')}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleJoinRoom} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="inviteCode">{t('inviteCode')}</Label>
                  <Input
                    id="inviteCode"
                    placeholder={t('inviteCodePlaceholder')}
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t('joining') : t('joinRoom')}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* 방 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rooms.length === 0 ? (
            <Card className="col-span-full p-10 text-center">
              <Lock className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-600 mb-2">{t('noRooms')}</p>
              <p className="text-sm text-gray-500">
                {t('noRoomsDescription')}
              </p>
            </Card>
          ) : (
            rooms.map((room) => (
              <Card key={room.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      {room.name}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => onNavigate('private-chat', room.id)}
                    >
                      {t('enter')}
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    {t('members')} {room.members.length}명 · {new Date(room.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="text-xs text-gray-600">{t('inviteCode')}</p>
                        <p className="font-mono">{room.inviteCode}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyInviteCode(room.inviteCode)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-600">{t('inviteLink')}</p>
                        <p className="text-sm truncate">{room.inviteLink}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyInviteLink(room.inviteLink)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}