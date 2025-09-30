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
    href: 'https://x.com/botscreator',
    icon: faTwitter
  },
  {
    label: 'Telegram',
    href: 'https://t.me/botscreator',
    icon: faTelegram
  },
  {
    label: 'Discord',
    href: 'https://discord.gg/launchlab',
    icon: faDiscord
  },
  {
    label: 'GitHub',
    href: 'https://github.com/launchlab-ai',
    icon: faGithub
  }
]; 