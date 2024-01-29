<template>
  <div>
    <Header></Header>
    <layout_nav></layout_nav>
    <layout_main></layout_main>
  </div>
</template>
<script setup lang="ts">
import Header from '@/components/Header/header.vue'
import layout_nav from '@/components/Nav/left_nav.vue'
import layout_main from '@/components/Main/Main.vue'
</script>

<style scoped>
.header {
  position: absolute;
  line-height: 50px;
  padding: 0;
  top: 0;
  left: 0;
  right: 0;
  overflow-y: auto;
  background-color: #2d3a4b;
}

.navbar {
  position: absolute;
  width: 230px;
  top: 55px;
  left: 0px;
  bottom: 0px;
  overflow-y: auto;
  background-color: #545c64;
}

.main {
  position: absolute;
  overflow-y: auto;
  top: 50px;
  left: 230px;
  bottom: 0px;
  right: 0px;
  padding: 10px;
  padding: 20px;
}
</style>
