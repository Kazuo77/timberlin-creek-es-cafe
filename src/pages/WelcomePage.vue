<template>
  <div class="welcome-page">
    <div class="welcome-content">
      <img src="../assets/images/DCPS_Logo.png" class="logo-img" alt="DCPS Logo" />
      <div class="logo-mark">
        <span class="logo-icon">◈</span>
      </div>
      <h1 class="room-name">Conference Room</h1>
      <p class="room-subtitle">Audio / Video Control</p>
      <p>{{ digitalTest }}</p>
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
import { defineComponent, ref, onMounted, onUnmounted, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { JOINS } from '../joins';
import { pulse} from '../useCrComLib'; 
//import { webXPanelConfig } from '../webxpanel.config'; 

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
    const digitalTest = ref(false);
    

    onMounted(() => {      
      //const mainPageSubId = window.CrComLib.subscribeState('b',JOINS.digital.mainPageFb,(value: boolean) => {console.log('call fired', value ); digitalTest.value = value}); 
      console.log('Mainpage Join:', JOINS.digital.mainPageFb);
      const mainPageSubId = window.CrComLib.subscribeState('b', JOINS.digital.mainPageFb, (value: boolean) => {
        if (value) router.push('/main'); 
        digitalTest.value = value;
      });
      

      onUnmounted(() => {
        window.CrComLib.unsubscribeState('b', JOINS.digital.mainPageFb, mainPageSubId);
      });
    });

    const enter = () => pulse(JOINS.digital.mainPage)

    //const enter = () => router.push('/main');

    return { systemOnline, enter ,digitalTest};
  }
});
</script>

<style scoped>
.welcome-page {
  width: 1280px;
  height: 800px;
  background: #f7f6f2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  font-family: 'Georgia', serif;
}

/* Subtle grid texture */
.welcome-page::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
}

.welcome-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  z-index: 1;
}

.logo-mark {
  font-size: 48px;
  color: #1a1a1a;
  line-height: 1;
  margin-bottom: 8px;
  animation: pulse-logo 3s ease-in-out infinite;
}
.logo-img{
  width: 200px;
  height: auto;
}
@keyframes pulse-logo {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.95); }
}

.room-name {
  font-size: 52px;
  font-weight: 400;
  color: #1a1a1a;
  letter-spacing: 0.08em;
  margin: 0;
  text-transform: uppercase;
}

.room-subtitle {
  font-family: 'Courier New', monospace;
  font-size: 14px;
  letter-spacing: 0.25em;
  color: #888;
  text-transform: uppercase;
  margin: 0;
}

.start-btn {
  margin-top: 40px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 48px;
  background: #1a1a1a;
  color: #f7f6f2;
  border: none;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  transition: background 0.2s, transform 0.1s;
  -webkit-tap-highlight-color: transparent;
}

.start-btn:active {
  background: #333;
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
  color: #aaa;
  text-transform: uppercase;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ccc;
  transition: background 0.4s;
}

.status-dot.online {
  background: #4caf50;
  box-shadow: 0 0 6px rgba(76, 175, 80, 0.6);
}
</style>
