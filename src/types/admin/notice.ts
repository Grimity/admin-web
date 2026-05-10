export interface CreateNoticePayload {
  title: string;
  content: string;
}

export interface CreateNoticeResponse {
  id: string;
}

export interface UpdateNoticePayload {
  title: string;
  content: string;
}
