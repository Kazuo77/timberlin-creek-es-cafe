<template>
  <div class="welcome-page">
    <div class="logo-section">
      <img src="../assets/images/DCPS_Logo.png" class="logo-img" alt="DCPS Logo" />
    </div>
    <div class="welcome-content">
      <h1 class="room-name">Cafetorium</h1>
      <p class="room-subtitle">Audio / Video Control</p>      
      <button class="start-btn" @click="enter">
        <span class="btn-label">Touch to Begin</span>
        <span class="btn-arrow">→</span>
      </button>
    </div>
    <div class="status-bar">
      <span class="status-dot" :class="{ online: systemOnline }"></span>
      <span class="status-text">{{ systemOnline ? 'System Ready' : 'Connecting…' }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { JOINS } from '../joins';
import { pulse } from '../useCrComLib';

export default defineComponent({
  name: 'WelcomePage',
  props: {
    systemOnline: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const router = useRouter();
    const { systemOnline } = toRefs(props);

    onMounted(() => {
      const mainPageSubId = window.CrComLib.subscribeState('b', JOINS.digital.mainPageFb, (value: boolean) => {
        if (value) router.push('/main');
      });

      onUnmounted(() => {
        window.CrComLib.unsubscribeState('b', JOINS.digital.mainPageFb, mainPageSubId);
      });
    });

    const enter = () => pulse(JOINS.digital.mainPage);

    return { systemOnline, enter };
  }
});
</script>

<style scoped>
.welcome-page {
  width: 1280px;
  height: 800px;
  background: linear-gradient(135deg, #2651a1 0%, #1e4c91 40%, #1565c0 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  font-family: 'Georgia', serif;
  padding: 48px 0 80px 0;
  box-sizing: border-box;
}

/* Subtle radial glow overlay */
.welcome-page::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 70% 30%, rgba(21, 101, 192, 0.3) 0%, transparent 60%);
  pointer-events: none;
}

/* Accent bar at top */
.welcome-page::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: #1565c0;
}

/* Logo section — takes upper portion */
.logo-section {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  z-index: 1;
}

.logo-img {
  width: 650px;
  height: auto;
}

/* Content section — pushed toward bottom */
.welcome-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  z-index: 1;
}

.room-name {
  font-size: 48px;
  font-weight: 400;
  color: #ffffff;
  letter-spacing: 0.08em;
  margin: 0;
  text-transform: uppercase;
}

.room-subtitle {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  letter-spacing: 0.25em;
  color: rgba(255,255,255,0.5);
  text-transform: uppercase;
  margin: 0;
}

.start-btn {
  margin-top: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 48px;
  background: rgba(255,255,255,0.1);
  color: #ffffff;
  border: 1px solid rgba(255,255,255,0.3);
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  transition: background 0.2s, transform 0.1s;
  -webkit-tap-highlight-color: transparent;
}

.start-btn:active {
  background: rgba(255,255,255,0.2);
  transform: scale(0.98);
}

.btn-arrow {
  font-size: 18px;
  transition: transform 0.2s;
}

.start-btn:active .btn-arrow {
  transform: translateX(4px);
}

.status-bar {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  letter-spacing: 0.15em;
  color: rgba(255,255,255,0.4);
  text-transform: uppercase;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  transition: background 0.4s;
}

.status-dot.online {
  background: #4caf50;
  box-shadow: 0 0 6px rgba(76, 175, 80, 0.6);
}
</style>