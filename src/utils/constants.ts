import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { 
  faTwitter, 
  faTelegram, 
  faDiscord, 
  faGithub 
} from '@fortawesome/free-brands-svg-icons';

interface SocialLink {
  label: string;
  href: string;
  icon: IconDefinition;
}

export const socialLinks: SocialLink[] = [
  {
    label: 'Twitter',
    href: 'https://twitter.com/agentz_ai',
    icon: faTwitter
  },
  {
    label: 'Telegram',
    href: 'https://t.me/agentz_ai',
    icon: faTelegram
  },
  {
    label: 'Discord',
    href: 'https://discord.gg/agentz',
    icon: faDiscord
  },
  {
    label: 'GitHub',
    href: 'https://github.com/agentz-ai',
    icon: faGithub
  }
]; 