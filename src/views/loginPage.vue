<template>
  <div align="center">
    <h1>请输入你的用户ID:</h1>
    <input type="text" v-model="userID" placeholder="561018" />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const userID = ref('')
</script>
