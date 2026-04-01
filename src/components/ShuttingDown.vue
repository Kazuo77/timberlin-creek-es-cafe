<template>
  <div class="overlay">
    <div class="dialog">
      <div class="spinner-wrap">
        <div class="spinner"></div>
      </div>
      <h2 class="shutdown-title">Shutting Down</h2>
      <p class="shutdown-body">Please wait while the system powers off.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ShuttingDown',
});
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  width: 1280px;
  height: 800px;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.dialog {
  width: 640px;
  height: 400px;
  background: #f7f6f2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 48px;
  box-sizing: border-box;
  border-top: 4px solid #1a1a1a;
}

.spinner-wrap {
  width: 64px;
  height: 64px;
}

.spinner {
  width: 64px;
  height: 64px;
  border: 4px solid #e0ddd6;
  border-top-color: #1a1a1a;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.shutdown-title {
  font-family: 'Georgia', serif;
  font-size: 28px;
  font-weight: 400;
  color: #1a1a1a;
  margin: 0;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.shutdown-body {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  letter-spacing: 0.08em;
  color: #888;
  text-align: center;
  margin: 0;
  line-height: 1.6;
}
</style>