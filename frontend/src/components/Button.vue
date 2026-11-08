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
.Button {
  width: 100%;
  display: flex;
  justify-content: center;
}

.button-petri {
  background-color: #d20066;
  display: flex;
  width: 220px;
  min-height: 48px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  color: #fafafa;
  font-size: 16px;
  font-weight: 600;
  font-family: inherit;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  margin-top: 12px;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
  box-shadow: 0 3px 6px rgba(210, 0, 102, 0.15);
}

.button-petri:hover {
  background-color: #b80059;
  transform: translateY(-2px);
  box-shadow: 0 5px 10px rgba(210, 0, 102, 0.22);
}

.button-petri:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(210, 0, 102, 0.15);
}

.button-petri:focus-visible {
  outline: 3px solid rgba(210, 0, 102, 0.3);
  outline-offset: 3px;
}
</style>