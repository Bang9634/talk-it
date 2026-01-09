import { useLanguage } from '../i18n/LanguageContext';
import { Language, languageNames } from '../i18n/translations';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Languages, Check } from 'lucide-react';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">
          <Languages className="h-4 w-4 mr-2" />
          {languageNames[language]}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-2">
        <div className="space-y-1">
          {(Object.keys(languageNames) as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
            >
              <span>{languageNames[lang]}</span>
              {language === lang && <Check className="h-4 w-4 text-blue-600" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
