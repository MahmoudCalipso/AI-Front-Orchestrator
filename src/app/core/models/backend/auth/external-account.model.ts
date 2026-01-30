// External Account Models

import { UUID, Timestamp, Metadata } from '../types/common.types';
import { ExternalProvider } from '../types/enums';

export interface ExternalAccount {
  id: UUID;
  user_id: UUID;
  provider: ExternalProvider;
  provider_user_id: string;
  access_token: string; // Encrypted
  refresh_token?: string; // Encrypted
  token_type: string;
  expires_at?: Timestamp;
  username?: string;
  email?: string;
  avatar_url?: string;
  scopes: string[]; // JSON list stored as string
  created_at: Timestamp;
  updated_at: Timestamp;
  last_used?: Timestamp;
  metadata?: Metadata;
}

export interface OAuthConfig {
  provider: ExternalProvider;
  client_id: string;
  client_secret: string;
  authorization_url: string;
  token_url: string;
  user_info_url: string;
  scopes: string[];
  redirect_uri: string;
}

export interface OAuthToken {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in?: number;
  expires_at?: Timestamp;
  scope?: string;
}

export interface OAuthUserInfo {
  id: string;
  username?: string;
  email?: string;
  name?: string;
  avatar_url?: string;
  provider: ExternalProvider;
  raw_data: { [key: string]: any };
}
