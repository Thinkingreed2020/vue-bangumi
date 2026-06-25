<template>
  <div align="center">
    <h1>
      bangumi-ThePrivate<text style="color: red">Anime</text
      ><text style="color: blue">Comic</text>RecommendationSystem
    </h1>
    <h2 v-if="mainichi">当前日是{{ weekday }} 主日是{{ mainichi.weekday.ja }}</h2>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { getMainichi } from '@/api/bangumi'

const date = new Date()
const weekday = date.getDay()
const mainichi = await getMainichi()
console.log(weekday)
console.log(date)
</script>
