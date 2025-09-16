export interface Message {
  text: string;
  type: 'sent' | 'received';
  email: string;
  created_at: string;
}