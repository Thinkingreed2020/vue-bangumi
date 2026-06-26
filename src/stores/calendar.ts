import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getMainichi, BangumiApiError } from '@/api/bangumi'
import type { mainichi } from '@/types/bangumi'

const STORAGE_KEY = 'calendar-cache'

function todayString() {
  return new Date().toDateString()
}

interface CalendarCache {
  date: string
  data: mainichi[]
}

export const useCalendarStore = defineStore('calendar', () => {
  const calendarList = ref<mainichi[]>([])
  const fetchedDate = ref('')
  const loading = ref(false)
  const error = ref('')

  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) {
    try {
      const cached = JSON.parse(raw) as CalendarCache
      if (cached.date === todayString()) {
        calendarList.value = cached.data
        fetchedDate.value = cached.date
      }
    } catch {
      // 缓存损坏时忽略，走正常请求
    }
  }

  async function fetchCalendar(force = false) {
    if (!force && fetchedDate.value === todayString() && calendarList.value.length > 0) {
      return
    }
    loading.value = true
    error.value = ''
    try {
      const data = await getMainichi()
      calendarList.value = data
      fetchedDate.value = todayString()
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ date: fetchedDate.value, data } satisfies CalendarCache),
      )
    } catch (err) {
      error.value = err instanceof BangumiApiError ? err.message : '加载失败'
    } finally {
      loading.value = false
    }
  }

  return { calendarList, fetchedDate, loading, error, fetchCalendar }
})
