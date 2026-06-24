import axios from 'axios'
import type { GetUserCollectionsParams, UserCollectionsResult } from '@/types/bangumi'

const bangumiClient = axios.create({
  baseURL: 'https://api.bgm.tv',
  headers: {
    Accept: 'application/json',
    // 'User-Agent': 'thinkingreed2020/vue-bangumi (https://github.com/Thinkingreed2020/vue-bangumi)',
  },
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
