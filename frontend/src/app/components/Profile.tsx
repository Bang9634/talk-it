import { User } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, User as UserIcon, Mail, Calendar, LogOut } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

interface ProfileProps {
  user: User;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function Profile({ user, onNavigate, onLogout }: ProfileProps) {
  const { t } = useLanguage();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 헤더 */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('public-chat')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl">{t('myProfile')}</h1>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <Button variant="ghost" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              {t('logout')}
            </Button>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <CardTitle className="text-2xl">{user.username}</CardTitle>
                <CardDescription>{t('talkItUser')}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <UserIcon className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">{t('username')}</p>
                  <p className="font-medium">{user.username}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Mail className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">{t('email')}</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">{t('joinedDate')}</p>
                  <p className="font-medium">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t space-y-3">
              <Button
                className="w-full"
                variant="outline"
                onClick={() => onNavigate('private-rooms')}
              >
                {t('managePrivateRooms')}
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => onNavigate('public-chat')}
              >
                {t('goToPublicChat')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}