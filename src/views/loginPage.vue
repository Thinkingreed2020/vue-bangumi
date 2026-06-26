<template>
  <div align="center">
    <h1>请输入你的用户ID:</h1>
    <input type="text" v-model="userID" :placeholder="defaultID" @keyup.enter="handleSearch" />
    <br /><button @click="handleSearch">get collections</button>
  </div>
</template>
<script setup lang="ts">
import { getUserCollections } from '@/api/bangumi'
import router from '@/router'
import { ref } from 'vue'

const userID = ref('')
const defaultID = ref('561018')
function handleSearch() {
  const query = userID.value.trim() || defaultID.value
  getUserCollections(query)
  router.push({ path: '/user/' + query })
}
</script>
