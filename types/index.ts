export interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  image_url: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface AuthConfig {
  id: string;
  security_question: string;
  security_answer: string;
  created_at: string;
}

export interface CreateTimelineEvent {
  title: string;
  date: string;
  description: string;
  image_url?: string | null;
  order_index?: number;
}

export interface UpdateTimelineEvent {
  title?: string;
  date?: string;
  description?: string;
  image_url?: string | null;
  order_index?: number;
}
