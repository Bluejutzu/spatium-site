import { type ReactNode } from 'react';

export interface BaseComponent {
  children?: ReactNode;
  className?: string;
}

export interface DashboardProps {
  serverId?: string;
}

export interface AnimatedCounterProps {
  end: number;
  duration?: number;
}

export interface StatCard {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  description: string;
  growth: string;
}

export interface FeatureCard {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  accent: string;
}

export interface NavigationItem {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface ThemeColors {
  'discord-blurple': string;
  'discord-green': string;
  'discord-yellow': string;
  'discord-red': string;
  'discord-orange': string;
  'discord-purple': string;
  'discord-dark': string;
  'discord-darker': string;
  'discord-text': string;
  'discord-border': string;
}

export interface BlockCategory {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export type BlockTypeCategory =
  | 'options'
  | 'messaging'
  | 'logic'
  | 'utilities'
  | 'moderation'
  | 'roles'
  | 'utility'
  | 'channels'
  | 'voice'
  | 'webhooks'
  | 'members';

export interface BlockType {
  type: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: BlockTypeCategory;
}