import dayjs from 'dayjs'
import type { components } from './types/generated'
import type { ApplicationItem, ConversationItem, NoteTone, QAItem, TagItem, UserSummary } from '@/types/models'
import { stableTone } from '@/utils/stableTone'

type Identity = components['schemas']['PublicIdentityView'] | null
type Recommendation = components['schemas']['RecommendationView']
type TagDto = components['schemas']['TagView']
type ApplicationDto = components['schemas']['ApplicationView']
type ConversationDto = components['schemas']['ConversationView']

const motifOptions = ['book', 'moon', 'gamepad', 'shoes', 'pan', 'camera']
const motifByTone: Record<NoteTone, string> = { yellow: '🎮', blue: '🌙', green: '📖' }

function pickMotif(seed: string | number) {
  const key = typeof seed === 'number' ? seed : Array.from(seed).reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
  return motifOptions[key % motifOptions.length]!
}

function relativeTime(value?: string | null) {
  if (!value) return '刚刚'
  const hours = Math.max(0, dayjs().diff(dayjs(value), 'hour'))
  if (hours < 1) return '刚刚'
  if (hours < 24) return `${hours} 小时前`
  return `${Math.max(1, Math.floor(hours / 24))} 天前`
}

const durationLabels: Record<string, string> = { DAY: '一天', WEEK: '本周', MONTH: '30 天', LONG_TERM: '长期' }

/** 把后端时长枚举渲染成中文标签，避免把 DAY/WEEK 等原始枚举直接暴露给用户 */
export function durationLabel(value?: string | null) {
  return durationLabels[value || ''] || '一段时间'
}

export function identityToUser(identity: Identity, fallbackId: string): UserSummary {
  const name = identity?.displayName || 'TAGO 用户'
  // 演示阶段：把非真实用户映射到 static/avatars/u{0..6}.png，让各页面头像贴近设计稿
  const avatarIndex = Array.from(name).reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % 7
  return {
    id: identity?.publicId ? `u${avatarIndex}` : fallbackId,
    name,
    // PublicIdentityView 没有 city 字段，用 @publicId 作为身份位置展示
    city: identity?.publicId ? `@${identity.publicId}` : '线上',
    avatar: name.slice(0, 1),
  }
}

const modeLabels: Record<string, string> = { NATURAL: '自然相遇', PERSONALIZED: '为你挑选' }

export function recommendationToTag(item: Recommendation, index: number, generatedAt?: string | null): TagItem {
  const tone = stableTone(item.tagId)
  return {
    id: item.tagId,
    author: identityToUser(item.ownerIdentity, `api-recommendation-${index}`),
    title: item.body.startsWith('#') ? item.body : `# ${item.body}`,
    summary: item.reason,
    timeLabel: relativeTime(generatedAt),
    labels: [
      modeLabels[item.mode] || '自然相遇',
      ...item.evidenceRefs.slice(0, 2).map(value => {
        if (value.startsWith('question:')) return `Q${value.slice('question:'.length)} 回答相投`
        if (value.startsWith('profile:')) return '同好关注'
        return value
      }),
    ],
    motif: pickMotif(index),
    tone,
    ctaType: index % 2 ? 'APPLY' : 'DETAIL',
    questions: item.questions.map((question, questionIndex) => ({
      id: `${item.tagId}-${questionIndex}`,
      question,
      answer: '',
    })),
  }
}

export function tagDtoToTag(item: TagDto): TagItem {
  const tone = stableTone(item.id)
  const answers = new Map(item.publisherAnswers.map(answer => [answer.slot, answer.text]))
  const questions: QAItem[] = item.questions.map(question => ({
    id: `${item.id}-${question.slot}`,
    question: question.text || `问题 ${question.slot}`,
    answer: answers.get(question.slot) || '',
  }))
  return {
    id: item.id,
    author: identityToUser(item.ownerIdentity, `api-tag-${item.ownerId}`),
    title: item.body.startsWith('#') ? item.body : `# ${item.body}`,
    summary: item.embedding?.state === 'READY' ? '正在等待有共鸣的人～' : '这条 Tag 正在生成更合适的推荐～',
    timeLabel: relativeTime(item.publishedAt),
    labels: [item.encounterMode === 'ONLINE' ? '线上' : item.encounterMode === 'OFFLINE' ? '线下' : '都可以', durationLabel(item.duration)],
    motif: pickMotif(item.id),
    tone,
    ctaType: 'APPLY',
    questions,
  }
}

export function applicationDtoToItem(item: ApplicationDto, index: number): ApplicationItem {
  const questions = new Map(item.questions.map(question => [question.slot, question.text]))
  return {
    id: item.id,
    applicant: identityToUser(item.applicantIdentity, `api-application-${item.applicantId}`),
    tagTitle: item.tag.body.startsWith('#') ? item.tag.body : `# ${item.tag.body}`,
    message: item.applicantAnswers[0]?.text || '',
    timeLabel: relativeTime(item.submittedAt),
    tone: stableTone(`${item.id}-${index}`),
    answers: item.applicantAnswers.map(answer => ({
      id: `${item.id}-${answer.slot}`,
      question: questions.get(answer.slot) || `问题 ${answer.slot}`,
      answer: answer.text,
    })),
  }
}

export interface ConversationRowMeta {
  marker?: string
  preview?: string
  unread?: number
}

export function conversationDtoToItem(
  item: ConversationDto,
  index: number,
  options?: { meta?: ConversationRowMeta, reasonTag?: string | null },
): ConversationItem {
  const user = identityToUser(item.peerIdentity, `api-conversation-${item.peerId}`)
  // 认识缘由：优先取相遇快照里的 Tag 名（真实数据），否则回退占位文案
  const tagTitle = options?.reasonTag ? `# ${options.reasonTag}` : `与 ${user.name} 的会话`
  return {
    id: item.id,
    user,
    tagTitle,
    preview: options?.meta?.preview || `建立于${relativeTime(item.createdAt)}`,
    timeLabel: relativeTime(item.createdAt),
    unread: options?.meta?.unread || 0,
    marker: options?.meta?.marker,
  }
}
