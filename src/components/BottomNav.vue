<template>
  <div class="bottom-nav-wrap">

    <!-- Volume gauge popup -->
    <Transition name="gauge-pop">
      <div class="gauge-popup" v-if="gaugeVisible">
        <div class="gauge-track">
          <div class="gauge-fill" :style="{ width: gaugePercent + '%' }"></div>
        </div>
        <span class="gauge-value">{{ gaugePercent }}%</span>
      </div>
    </Transition>
    <Teleport to="body">
        <ConfirmShutdown
        v-if="showConfirm"
        @confirm="confirmShutdown"
        @cancel="cancelShutdown"/>
    </Teleport>
    <Teleport to="body">
      <ShuttingDown v-if="isShuttingDown" />
    </Teleport>

    <div class="bottom-nav">
      
      <!-- Section nav -->
      <div class="nav-left">
        <button
          class="nav-btn"
          :class="{ active: activeSection === 'routing' }"
          @click="$emit('section', 'routing')"
        >
          <span class="nav-icon">⇄</span>
          <span class="nav-label">Routing</span>
        </button>
        <button
          class="nav-btn"
          :class="{ active: activeSection === 'mics' }"
          @click="$emit('section', 'mics')"
        >
          <span class="nav-icon">⊕</span>
          <span class="nav-label">Microphones</span>
        </button>
      </div>
      <!-- Shutdown confirmation -->
      
      <!-- Nav-Right -->
      <div class="nav-right">
        <!-- Volume controls -->
        <div class="vol-controls">
          <button class="vol-btn" @click="volDown">
            <span class="vol-icon">−</span>
          </button>
          <button
            class="vol-btn mute-btn"
            :class="{ muted: isMuted }"
            @click="toggleMute"
            @mouseenter="gaugeVisible = true"
            @mouseleave="gaugeVisible = false"
          >
            <span class="vol-icon">{{ isMuted ? '✕' : '✕' }}</span>
            <span class="nav-label">{{ isMuted ? 'Muted' : 'Global Mute' }}</span>
          </button>
          <button class="vol-btn" @click="volUp">
            <span class="vol-icon">+</span>
          </button>
        </div>
        
        <button class="shutdown-btn" @click="onShutdown">          
          <span class="nav-label">Shutdown</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted,} from 'vue';
import { JOINS } from '../joins';
import { useRouter } from 'vue-router';
import ConfirmShutdown  from './ConfirmShutdown.vue';
import ShuttingDown from './ShuttingDown.vue';
import { pulse } from '../useCrComLib';

export default defineComponent({
  name: 'BottomNav',
  components: {ConfirmShutdown, ShuttingDown},
  props: {
    activeSection: {
      type: String,
      default: 'routing'
    }
  },
  emits: ['section'],
  setup() {
    const isMuted       = ref(false);
    const volLevel      = ref(0);
    const gaugeVisible  = ref(false);
    const router        = useRouter();
    const isShuttingDown = ref(false);

    const gaugePercent = computed(() =>
      Math.round((volLevel.value / 65535) * 100)
    );

    let gaugeTimer: ReturnType<typeof setTimeout> | null = null;
    const flashGauge = () => {
      gaugeVisible.value = true;
      if (gaugeTimer) clearTimeout(gaugeTimer);
      gaugeTimer = setTimeout(() => { gaugeVisible.value = false; }, 2000);
    };

    const subs: Array<{ type: 'b' | 'n' | 's'; join: string; id: string }> = [];
    const sub = (type: 'b' | 'n' | 's', join: string, cb: (v: any) => void) => {
      const id = window.CrComLib.subscribeState(type, join, cb);
      subs.push({ type, join, id });
    };

    const toggleMute = () => pulse(JOINS.digital.volMute);
    const volUp      = () => { pulse(JOINS.digital.volUp);   flashGauge(); };
    const volDown    = () => { pulse(JOINS.digital.volDown); flashGauge(); };

    //Shutdown Teleport
    const showConfirm = ref(false);

    const onShutdown = () => {
      showConfirm.value = true;
    }

    const confirmShutdown = () => {
      showConfirm.value = false;
      pulse(JOINS.digital.shutdown)  
    
    };
    const cancelShutdown = () => {
      showConfirm.value = false;
    };

    //subscriptions managed here - 
    // sub and subs handle subscriptions onMounted and onUnmounted
    onMounted(() => {
      sub('b', JOINS.digital.volMuteFb, (v: boolean) => isMuted.value = v);
      sub('n', JOINS.analog.mic9Level,    (v: number)  => {
        volLevel.value = v;
        flashGauge();
      });

      sub('b', JOINS.digital.sysBusyFb, (value: boolean)  => {
        isShuttingDown.value = value;
      })

        sub('b', JOINS.digital.welcomePageFb, (value: boolean) => {
          if (value) router.push('/');
        });
        
      onUnmounted(() => {
      if (gaugeTimer) clearTimeout(gaugeTimer);
      subs.forEach(({ type, join, id }) =>
        window.CrComLib.unsubscribeState(type, join, id)
      );
    });
    });

    return { isMuted, gaugePercent, gaugeVisible, toggleMute, volUp, volDown, onShutdown, showConfirm, confirmShutdown, cancelShutdown, 
      isShuttingDown
    };
  }
});
</script>

<style scoped>
.bottom-nav-wrap {
  position: relative;
  flex-shrink: 0;
}

/* Gauge popup */
.gauge-popup {
  position: absolute;
  bottom: 112px;
  right: 170px;
  width: 290px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #1a1a1a;
  border: 1px solid #444;
  padding: 10px 14px;
  pointer-events: none;
}

.gauge-track {
  flex: 1;
  height: 6px;
  background: #444;
}

.gauge-fill {
  height: 100%;
  background: #f7f6f2;
  transition: width 0.2s ease;
}

.gauge-value {
  font-family: 'Courier New', monospace;
  font-size: 11px;
  color: #f7f6f2;
  letter-spacing: 0.1em;
  min-width: 36px;
  text-align: right;
}

.gauge-pop-enter-active,
.gauge-pop-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.gauge-pop-enter-from,
.gauge-pop-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

/* Bottom bar */
.bottom-nav {
  width: 100%;
  height: 110px;
  background: #1a1a1a;
  display: flex;
  align-items: center;
  padding: 0 16px;
  box-sizing: border-box;
}

.nav-left {
  display: flex;
  gap: 4px;
  flex: 1;
}

.nav-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80px;
  width: 150px;
  gap: 3px;
  background: transparent;
  border: 1px solid transparent;
  color: #888;
  cursor: pointer;
  transition: all 0.15s;
  -webkit-tap-highlight-color: transparent;
}

.nav-btn.active {
  color: #f7f6f2;
  border-color: #444;
  background: #2a2a2a;
}

.nav-btn:active {
  background: #333;
}

.nav-icon {
  font-size: 18px;
  line-height: 1;
}

.nav-label {
  font-family: 'Courier New', monospace;
  font-size: 15px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

/* Volume controls */
.vol-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.vol-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  width: 100px;
  height: 80px;
  background: transparent;
  border: 1px solid #333;
  color: #888;
  cursor: pointer;
  font-size: 20px;
  transition: all 0.15s;
  -webkit-tap-highlight-color: transparent;
}

.vol-btn:active {
  background: #333;
  color: #f7f6f2;
}

.mute-btn {
  width: 100px;
  border-color: #444;
  color: #f7f6f2;
}

.mute-btn.muted {
  background: #c0504d;
  border-color: #c0504d;
  color: #fff;
}

.mute-btn .nav-label {
  color: #888;
}

.mute-btn.muted .nav-label {
  color: rgba(255, 255, 255, 0.7);
}

/* Shutdown */
.nav-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.shutdown-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  justify-content: center;
  height: 80px;
  width: 150px;
  background: transparent;
  border: 1px solid #5a1a1a;
  color: #c0504d;
  cursor: pointer;
  transition: all 0.15s;
  -webkit-tap-highlight-color: transparent;
}

.shutdown-btn:active {
  background: #3a1010;
  border-color: #c0504d;
}

.shutdown-icon {
  font-size: 24px;
  line-height: 1;
}

@media (orientation: portrait) {
  .bottom-nav {
    height: 20vh;
    flex-wrap: wrap;
    align-content: center;
    padding: 0 8px;
    gap: 4px;
  }

  .nav-left {
    width: 100%;
    justify-content: flex-start;
    gap: 8px;
  }

  .nav-right {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
