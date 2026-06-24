// Bangumi API: GET /v0/users/{username}/collections
// https://bangumi.github.io/api/

/** 条目类型：1=书籍 2=动画 3=音乐 4=游戏 6=三次元 */
export type SubjectType = 1 | 2 | 3 | 4 | 6

/** 收藏状态：1=想看 2=看过 3=在看 4=搁置 5=抛弃 */
export type CollectionType = 1 | 2 | 3 | 4 | 5

export interface SubjectImages {
  small: string
  grid: string
  large: string
  medium: string
  common: string
}

/** 收藏列表里嵌套的精简条目信息 */
export interface SlimSubject {
  id: number
  type: SubjectType
  name: string
  name_cn: string
  short_summary: string
  images: SubjectImages
  tags: { name: string; count: number }[]
  score: number
  rank: number
  collection_total: number
}

/** 单条用户收藏 */
export interface UserSubjectCollection {
  subject_id: number
  subject_type: SubjectType
  subject: SlimSubject
  /** 收藏状态 */
  type: CollectionType
  rate: number
  ep_status: number
  vol_status: number
  comment: string | null
  tags: string[]
  /** 是否私有收藏（未登录访问公开收藏时该字段一般为 false） */
  private: boolean
  updated_at: string
}

export interface GetUserCollectionsParams {
  subject_type?: SubjectType
  type?: CollectionType
  /** 每页数量 至多50*/
  limit?: number
  offset?: number
}

export interface PagedResult<T> {
  total: number
  limit: number
  offset: number
  data: T[]
}

export type UserCollectionsResult = PagedResult<UserSubjectCollection>
