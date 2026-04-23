<template>
  <div class="overlay">
    <div class="dialog">
      <div class="dialog-header">
        <span class="dialog-icon">⏻</span>
        <h2 class="dialog-title">Shutdown System</h2>
      </div>
      <p class="dialog-body">Are you sure you want to shut down the system?</p>
      <div class="dialog-actions">
        <button class="cancel-btn" @click="$emit('cancel')">
          <span class="btn-icon">←</span>
          <span class="btn-label">Cancel</span>
        </button>
        <button class="confirm-btn" @click="$emit('confirm')">
          <span class="btn-icon">⏻</span>
          <span class="btn-label">Shutdown</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ConfirmShutdown',
  emits: ['confirm', 'cancel'],
});
</script>

<style scoped>
/* Full screen overlay — blocks all touches behind the dialog */
.overlay {
  position: absolute;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* Dialog — roughly half the panel size */
.dialog {
  width: 640px;
  height: 400px;
  background: #f7f6f2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 28px;
  padding: 48px;
  box-sizing: border-box;
  border-top: 4px solid #c0504d;
}

.dialog-header {
  display: flex;
  align-items: center;
  gap: 14px;
}

.dialog-icon {
  font-size: 28px;
  color: #c0504d;
  line-height: 1;
}

.dialog-title {
  font-family: 'Georgia', serif;
  font-size: 28px;
  font-weight: 400;
  color: #1a1a1a;
  margin: 0;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.dialog-body {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  letter-spacing: 0.08em;
  color: #888;
  text-align: center;
  margin: 0;
  max-width: 420px;
  line-height: 1.6;
}

.dialog-actions {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.cancel-btn,
.confirm-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 48px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.15s;
  -webkit-tap-highlight-color: transparent;
  border: none;
}

.cancel-btn {
  background: #e8e4dc;
  color: #555;
  border: 1px solid #ccc;
}

.cancel-btn:active {
  background: #ddd;
}

.confirm-btn {
  background: #c0504d;
  color: #fff;
  border: 1px solid #c0504d;
}

.confirm-btn:active {
  background: #a03030;
}

.btn-icon {
  font-size: 16px;
}

.btn-label {
  font-weight: bold;
}
</style>
