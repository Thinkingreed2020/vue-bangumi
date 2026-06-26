<template>
  <div align="center">
    <h1>
      bangumi-ThePrivate<text style="color: red">Anime</text
      ><text style="color: blue">Comic</text>RecommendationSystem
    </h1>

    <h2 v-if="today">今日放送（{{ today.weekday.ja }}）</h2>

    <p v-if="calendarStore.loading">加载中...</p>
    <p v-else-if="calendarStore.error">{{ calendarStore.error }}</p>
    <p v-else-if="today && today.items.length === 0">今天没有番剧放送</p>

    <ul v-else-if="today" class="schedule-list">
      <li v-for="item in today.items" :key="item.id" class="schedule-item">
        <router-link :to="`/itemDetail/${item.id}`">
          <img :src="item.images.grid" :alt="item.name_cn || item.name" width="80" />
          <div class="info">
            <p>{{ item.name_cn || item.name }}</p>
            <p v-if="item.rating">评分：{{ item.rating.score ?? '暂无' }}</p>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useCalendarStore } from '@/stores/calendar'

const calendarStore = useCalendarStore()

// bgm.tv weekday.id：1=周一...7=周日；JS Date.getDay()：0=周日,1=周一...6=周六
function todayBgmWeekdayId() {
  const jsDay = new Date().getDay()
  return jsDay === 0 ? 7 : jsDay
}

const today = computed(() =>
  calendarStore.calendarList.find((day) => day.weekday.id === todayBgmWeekdayId()),
)

onMounted(() => calendarStore.fetchCalendar())
</script>

<style scoped>
.schedule-list {
  list-style: none;
  padding: 0;
}
.schedule-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  text-align: left;
}
</style>
