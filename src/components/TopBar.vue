<template>
  <div class="top-bar">    
    <div class="top-bar-left">      
      <div class="logo-section">
        <img src="../assets/images/sjcsd-logo.png" class="logo-img" alt="sjcsd Logo" />
      </div>
      <span class="room-label">Cafetorium</span>
    </div>
    <div class="top-bar-center">
      <span class="clock">{{ time }}</span>
    </div>
    <div class="top-bar-right">
      <span class="status-dot" :class="{ online: systemOnline }"></span>
      <span class="system-status">{{ systemOnline ? 'Online' : 'Offline' }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onUnmounted } from 'vue';

export default defineComponent({
  name: 'TopBar',
  props: {
    systemOnline: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const time = ref('');

    const updateTime = () => {
      time.value = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    onUnmounted(() => clearInterval(interval));

    return { time };
  }
});
</script>

<style scoped>
.top-bar {
  width: 100%;
  height: 56px;
  background: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-sizing: border-box;
  flex-shrink: 0;
}

.logo-img {
  width: 55px;
  height: auto;
}
.top-bar-left {
  display: flex;
  flex-direction: row;
  align-items: center;
}


.room-label {
  font-family: 'Georgia', serif;
  font-size: 16px;
  letter-spacing: 0.12em;
  color: #f7f6f2;
  text-transform: uppercase;
}

.clock {
  font-family: 'Courier New', monospace;
  font-size: 18px;
  color: #f7f6f2;
  letter-spacing: 0.1em;
}

.top-bar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #555;
  transition: background 0.4s;
}

.status-dot.online {
  background: #4caf50;
  box-shadow: 0 0 6px rgba(76, 175, 80, 0.5);
}

.system-status {
  font-family: 'Courier New', monospace;
  font-size: 11px;
  letter-spacing: 0.2em;
  color: #888;
  text-transform: uppercase;
}
</style>
