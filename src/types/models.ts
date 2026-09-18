export type NoteTone = 'yellow' | 'blue' | 'green'
export type TagCta = 'APPLY' | 'DETAIL' | 'WAITING' | 'NONE'

export interface UserSummary {
  id: string
  name: string
  city: string
  avatar: string
}

export interface QAItem {
  id: string
  question: string
  answer: string
}

export interface TagItem {
  id: string
  author: UserSummary
  title: string
  summary: string
  timeLabel: string
  labels: string[]
  motif: string
  tone: NoteTone
  ctaType: TagCta
  questions?: QAItem[]
  price?: number
}

export interface ApplicationItem {
  id: string
  applicant: UserSummary
  tagTitle: string
  message: string
  timeLabel: string
  tone: NoteTone
  answers: QAItem[]
}

export interface ConversationItem {
  id: string
  user: UserSummary
  tagTitle: string
  preview: string
  timeLabel: string
  unread: number
  marker?: string
}

export interface ChatMessage {
  id: string
  side: 'mine' | 'theirs' | 'system' | 'gift'
  content: string
  time?: string
  read?: boolean
  giftTitle?: string
  giftMeaning?: string
}

export interface GiftMoment {
  id: string
  month: string
  title: string
  from: string
  story: string
  date: string
  motif: string
  tone: NoteTone
  side: 'left' | 'right'
}
