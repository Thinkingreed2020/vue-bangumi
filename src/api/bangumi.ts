import axios from 'axios'
import { GetUserCollectionsParams, UserCollectionsResult } from '@/types/bangumi'

export const getUserCollections = async (username: string, params: GetUserCollectionsParams) => {
  return axios.get<UserCollectionsResult>(`/v0/users/${username}/collections`, { params })
}
