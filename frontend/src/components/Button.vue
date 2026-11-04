<script setup>
defineEmits(["click"]);
</script>

<template>
  <div class="Button">
    <button class="button-petri" type="button" @click="$emit('click')">
      <slot />
    </button>
  </div>
</template>

<style scoped>
.button-petri {
  background-color: #d20066;
  display: flex;
  width: 200px;
  height: 50px;
  border-radius: 5px;
  color: #fafafa;
  margin-top: 20px;
  font-size: 20px;
  align-items: center;
  justify-content: center;
}
</style>
