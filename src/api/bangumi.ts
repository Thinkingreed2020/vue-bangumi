import axios from 'axios'
import type {
  GetUserCollectionsParams,
  UserCollectionsResult,
  UserInfoResult,
  ItemDetail,
  mainichi,
} from '@/types/bangumi'

const bangumiClient = axios.create({
  baseURL: 'https://api.bgm.tv',
  headers: {
    Accept: 'application/json',
    // 'User-Agent': 'thinkingreed2020/vue-bangumi (https://github.com/Thinkingreed2020/vue-bangumi)',
  },
})
bangumiClient.interceptors.request.use((config) => {
  const token = import.meta.env.VITE_BGM_TOKEN
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export class BangumiApiError extends Error {
  status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'BangumiApiError'
    this.status = status
  }
}

export const getUserCollections = async (
  username: string,
  params?: GetUserCollectionsParams,
): Promise<UserCollectionsResult> => {
  try {
    const res = await bangumiClient.get<UserCollectionsResult>(
      `/v0/users/${username}/collections`,
      { params },
    )
    console.log(res.data)
    return res.data
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status
      if (status === 404) {
        throw new BangumiApiError(`用户 ${username} 不存在`, status)
      }
      if (status === 403 || status === 451) {
        throw new BangumiApiError(`用户 ${username} 的收藏不可见`, status)
      }
      throw new BangumiApiError(err.message, status)
    }
    throw err
  }
}

export const getUserInfo = async (username: string): Promise<UserInfoResult> => {
  try {
    const res = await bangumiClient.get<UserInfoResult>(`/v0/users/${encodeURIComponent(username)}`)
    return res.data
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status
      if (status === 404) {
        throw new BangumiApiError(`用户 ${username} 不存在`, status)
      }
      if (status === 403 || status === 451) {
        throw new BangumiApiError(`用户 ${username} 的信息不可见`, status)
      }
      throw new BangumiApiError(err.message, status)
    }
    throw err
  }
}

export const getMainichi = async (): Promise<mainichi[]> => {
  try {
    const res = await bangumiClient.get<mainichi[]>('/calendar')
    console.log(res.data)
    return res.data
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status
      if (status === 404) {
        throw new BangumiApiError(`获取每日放送表失败`, status)
      }
      throw new BangumiApiError(err.message, status)
    }
    throw err
  }
}
