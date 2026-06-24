<template>
  <div align="center">
    <h1 v-if="userInfo">
      <img :src="userInfo.avatar.medium" alt="用户头像" width="80" /> 用户名：{{
        userInfo.username
      }}，用户ID：{{ userID }}
    </h1>
    <p v-else-if="userInfoError">{{ userInfoError }}</p>

    <select v-model="subjectType">
      <option :value="undefined">全部</option>
      <option :value="1">书籍</option>
      <option :value="2">动画</option>
      <option :value="3">音乐</option>
      <option :value="4">游戏</option>
      <option :value="6">三次元</option>
    </select>

    <p v-if="collectionsLoading">加载中...</p>
    <p v-else-if="collectionsError">{{ collectionsError }}</p>

    <ul v-else class="collection-list">
      <li v-for="item in collections" :key="item.subject_id" class="collection-item">
        <router-link :to="`/itemDetail/${item.subject_id}`">
          <img :src="item.subject.images.medium" :alt="item.subject.name" width="80" />
          <div class="info">
            <p>{{ item.subject.name_cn || item.subject.name }}</p>
            <p>{{ item.subject.short_summary }}</p>
            <p v-if="item.rate">我的评分：{{ item.rate }}</p>
            <p v-else>未评分</p>
            <p v-if="item.comment">我的评论：{{ item.comment }}</p>
          </div>
        </router-link>
      </li>
    </ul>

    <div v-if="!collectionsLoading && !collectionsError">
      <button :disabled="offset === 0" @click="offset -= limit">上一页</button>
      <span>第 {{ offset / limit + 1 }} 页，共 {{ Math.max(1, Math.ceil(total / limit)) }} 页</span>
      <button :disabled="offset + limit >= total" @click="offset += limit">下一页</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getUserCollections, BangumiApiError, getUserInfo } from '@/api/bangumi'
import type { UserSubjectCollection, SubjectType, UserInfoResult } from '@/types/bangumi'
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const userID = ref(route.params.id as string)
const collections = ref<UserSubjectCollection[]>([])
const collectionsLoading = ref(false)
const collectionsError = ref('')
const subjectType = ref<SubjectType | undefined>(undefined)
const limit = 8
const offset = ref(0)
const total = ref(0)
const userInfo = ref<UserInfoResult>()
const userInfoError = ref('')

async function fetchCollections() {
  collectionsLoading.value = true
  collectionsError.value = ''
  try {
    const res = await getUserCollections(userID.value, {
      subject_type: subjectType.value,
      limit,
      offset: offset.value,
    })
    collections.value = res.data
    total.value = res.total
  } catch (err) {
    collectionsError.value = err instanceof BangumiApiError ? err.message : '加载失败'
  } finally {
    collectionsLoading.value = false
  }
}

onMounted(fetchCollections)
watch(
  () => route.params.id,
  (id) => {
    userID.value = id as string
    offset.value = 0
    fetchCollections()
  },
)
watch(subjectType, () => {
  offset.value = 0
  fetchCollections()
})
watch(offset, fetchCollections)

async function fetchUserInfo() {
  userInfoError.value = ''
  try {
    const res = await getUserInfo(userID.value)
    userInfo.value = res
  } catch (err) {
    userInfoError.value = err instanceof BangumiApiError ? err.message : '加载失败'
  }
}

onMounted(fetchUserInfo)
</script>

<style scoped>
.collection-list {
  list-style: none;
  padding: 0;
}
.collection-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  text-align: left;
}
</style>
