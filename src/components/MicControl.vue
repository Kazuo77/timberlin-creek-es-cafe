<template>
  <div class="mic-control" >
    <h2 class="section-title">Microphones</h2>

    <!-- Global mute -->
    <div class="global-row">
      <div class="global-info">
        <span class="global-label">{{ globalMuted ? 'All Muted' : 'All Mics Active' }}</span>
        <span class="global-action">{{ globalMuted ? 'Tap to Unmute All' : 'Tap to Mute All' }}</span>
      </div>
      <button
        class="global-mute-btn"
        :class="{ muted: globalMuted }"
        @click="toggleGlobalMute"
      >
        <span class="global-icon">{{ globalMuted ? '' : '' }}</span>
        <span class="global-btn-label">{{ globalMuted ? 'Unmute All' : 'Mute All' }}</span>
      </button>
    </div>  

    <!-- Per channel -->
    <div class="mic-grid" ref="scrollEl" @touchstart.passive="onTouchStart">
      <div
        v-for="(mic, index) in mics"
        :key="index"
        v-show="!hiddenMics.includes(index + 1)"
        class="mic-channel"
      >
        <div class="mic-header">
          <div class="mic-number">MIC {{ index + 1 }}</div>
          <div class="mic-name">{{ mic.label || `Channel ${index + 1}` }}</div>
        </div>

        <div class="mic-body">
          <!-- Vertical gauge -->
          <div class="gauge-wrap">
            <div class="gauge-track">
              <div class="gauge-fill" :style="{ height: Math.round((mic.level / 65535) * 100) + '%' }"></div>
            </div>
            <span class="gauge-value">{{ Math.round((mic.level / 65535) * 100) }}%</span>
          </div>

          <!-- Controls -->
          <div class="mic-controls">
            <button class="level-btn"
                    @click="levelUp(index)"
                @pointerdown="hold(MIC_JOINS.levelUp[index], true)"
                @pointerup="hold(MIC_JOINS.levelUp[index], false)" 
                @pointerleave="hold(MIC_JOINS.levelUp[index], false)" 
                @pointercancel="hold(MIC_JOINS.levelUp[index], false)"
              >
              <span>▲</span>
            </button>
            <button
              class="mic-mute-btn"
              :class="{ muted: mic.muted }"
              @click="toggleMic(index)"
            >
              <span class="mute-icon">{{ mic.muted ? '✕' : '◎' }}</span>
              <span class="mute-label">{{ mic.muted ? 'Muted' : 'Active' }}</span>
            </button>
            <button class="level-btn" 
                 @click="levelDown(index)"
                @pointerdown="hold(MIC_JOINS.levelDown[index], true)"
                @pointerup="hold(MIC_JOINS.levelDown[index], false)" 
                @pointerleave="hold(MIC_JOINS.levelDown[index], false)" 
                @pointercancel="hold(MIC_JOINS.levelDown[index], false)"
                    >
              <span>▼</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, onUnmounted } from 'vue';
import { JOINS } from '../joins';
import { pulse, hold } from '../useCrComLib';

const MIC_JOINS = {
  mute:      [JOINS.digital.mic1Mute,      JOINS.digital.mic2Mute,      JOINS.digital.mic3Mute,      JOINS.digital.mic4Mute,      JOINS.digital.mic5Mute      ,JOINS.digital.mic6Mute       ,JOINS.digital.mic7Mute       ,JOINS.digital.mic8Mute       ,JOINS.digital.mic9Mute       ,JOINS.digital.mic10Mute        ,JOINS.digital.mic11Mute        ,JOINS.digital.mic12Mute],
  muteFb:    [JOINS.digital.mic1MuteFb,    JOINS.digital.mic2MuteFb,    JOINS.digital.mic3MuteFb,    JOINS.digital.mic4MuteFb,    JOINS.digital.mic5MuteFb    ,JOINS.digital.mic6MuteFb     ,JOINS.digital.mic7MuteFb     ,JOINS.digital.mic8MuteFb     ,JOINS.digital.mic9MuteFb     ,JOINS.digital.mic10MuteFb       ,JOINS.digital.mic11MuteFb      ,JOINS.digital.mic12MuteFb ],
  levelUp:   [JOINS.digital.mic1LevelUp,   JOINS.digital.mic2LevelUp,   JOINS.digital.mic3LevelUp,   JOINS.digital.mic4LevelUp,   JOINS.digital.mic5LevelUp   ,JOINS.digital.mic6LevelUp    ,JOINS.digital.mic7LevelUp    ,JOINS.digital.mic8LevelUp    ,JOINS.digital.mic9LevelUp    ,JOINS.digital.mic10LevelUp     ,JOINS.digital.mic11LevelUp     ,JOINS.digital.mic12LevelUp],
  levelDown: [JOINS.digital.mic1LevelDown, JOINS.digital.mic2LevelDown, JOINS.digital.mic3LevelDown, JOINS.digital.mic4LevelDown, JOINS.digital.mic5LevelDown ,JOINS.digital.mic6LevelDown  ,JOINS.digital.mic7LevelDown  ,JOINS.digital.mic8LevelDown  ,JOINS.digital.mic9LevelDown  ,JOINS.digital.mic10LevelDown   ,JOINS.digital.mic11LevelDown   ,JOINS.digital.mic12LevelDown],
  label:     [JOINS.serial.mic1Label,      JOINS.serial.mic2Label,      JOINS.serial.mic3Label,      JOINS.serial.mic4Label,      JOINS.serial.mic5Label      ,JOINS.serial.mic6Label       ,JOINS.serial.mic7Label       ,JOINS.serial.mic8Label       ,JOINS.serial.mic9Label       ,JOINS.serial.mic10Label        ,JOINS.serial.mic11Label        ,JOINS.serial.mic12Label],
  level:     [JOINS.analog.mic1Level,      JOINS.analog.mic2Level,      JOINS.analog.mic3Level,      JOINS.analog.mic4Level,      JOINS.analog.mic5Level      ,JOINS.analog.mic6Level       ,JOINS.analog.mic7Level       ,JOINS.analog.mic8Level       ,JOINS.analog.mic9Level       ,JOINS.analog.mic10Level        ,JOINS.analog.mic11Level        ,JOINS.analog.mic12Level ],
};
  
export default defineComponent({
  name: 'MicControl',
  setup() {
    const globalMuted = ref(false);

    const hiddenMics = [11];

    const mics = reactive(
      Array.from({ length: 12 }, () => ({ muted: false, label: '', level: 0 }))
    );

    const subs: Array<{ type: 'b' | 'n' | 's'; join: string; id: string }> = [];
    const sub = (type: 'b' | 'n' | 's', join: string, cb: (v: any) => void) => {
      const id = window.CrComLib.subscribeState(type, join, cb);
      subs.push({ type, join, id });
    };

    onMounted(() => {
      scrollEl.value?.addEventListener('touchmove', onTouchMove, { passive: false });
      sub('b', JOINS.digital.micGlobalMuteFb, (v: boolean) => globalMuted.value = v);

      mics.forEach((_, i) => {
        sub('b', MIC_JOINS.muteFb[i],  (v: boolean) => mics[i].muted = v);
        sub('s', MIC_JOINS.label[i],   (v: string)  => mics[i].label = v);
        sub('n', MIC_JOINS.level[i],   (v: number)  => mics[i].level = v);
      });

      onUnmounted(() => {
        scrollEl.value?.removeEventListener('touchmove', onTouchMove);
        subs.forEach(({ type, join, id }) =>
          window.CrComLib.unsubscribeState(type, join, id)
        );
      });
    });

    const toggleGlobalMute = () => pulse(JOINS.digital.micGlobalMute);
    const toggleMic  = (index: number) => pulse(MIC_JOINS.mute[index]);
    const levelUp    = (index: number) => pulse(MIC_JOINS.levelUp[index]);
    const levelDown  = (index: number) => pulse(MIC_JOINS.levelDown[index]);
    //TODO:
    //switch the lvlup lvldown pulse with a held function

    const scrollEl = ref<HTMLElement | null>(null);
    let touchStartY = 0;

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      e.stopPropagation();
      const el = scrollEl.value;
      if (!el) return;
      const deltaY = touchStartY - e.touches[0].clientY;
      const atTop    = el.scrollTop <= 0;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight;
      if (e.cancelable && ((atTop && deltaY < 0) || (atBottom && deltaY > 0))) {
        e.preventDefault();
      }
    };

    return { hold, globalMuted, mics, toggleGlobalMute, toggleMic, levelUp, levelDown, scrollEl, onTouchStart, onTouchMove, hiddenMics, MIC_JOINS };
  }
});
</script>

<style scoped>
.mic-control {
  display:flex;
  flex-direction: column;
  padding: 24px 32px;
  height: 100%;
  box-sizing: border-box;
}

.section-title {
  font-family: 'Courier New', monospace;
  font-size: 15px;
  text-shadow: 2px 3px 6px rgba(0, 0, 0, 0.4);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #aaa;
  margin: 0 0 20px 0;
  font-weight: normal;
}

/* Global mute */
.global-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 16px 24px;
  background: #f0ede6;
}
.global-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.global-mute-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 24px;
  background: #fff;
  border: 1px solid #c0504d;
  color: #c0504d;
  cursor: pointer;
  transition: all 0.15s;
  -webkit-tap-highlight-color: transparent;
}


.global-mute-btn.muted {
  background: #c0504d;
  border-color: #c0504d;
  color: #fff;
}

.global-icon {
  font-size: 20px;
  line-height: 1;
}

.global-btn-label {
  font-family: 'Courier New', monospace;
  font-size: 14px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}


.global-mute-btn.muted .global-icon {
  color: #fff;
}

.global-label {
  font-family: 'Georgia', serif;
  font-size: 16px;
  text-shadow: 4px 5px 5px rgba(0, 0, 0, 0.2);
  color: #1a1a1a;
}

.global-mute-btn.muted .global-label {
  color: #fff;
}

.global-action {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  text-shadow: 4px 5px 5px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #aaa;
}

.global-mute-btn.muted .global-action {
  color: rgba(255,255,255,0.6);
}

/* Per channel grid */
.mic-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
  align-content: flex-start;
}

.mic-channel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 12px;
  background: #f0ede6;
  border: 1px solid #ddd;
  min-width: 150px;
}

.mic-header {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.mic-number {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  letter-spacing: 0.2em;
  color: #aaa;
  text-transform: uppercase;
}

.mic-name {
  font-family: 'Georgia', serif;
  font-size: 17px;
  text-shadow: 4px 5px 5px rgba(0, 0, 0, 0.2);
  color: #1a1a1a;
  min-height: 20px;
}

.mic-body {
  display: flex;
  gap: 10px;
  align-items: flex-end;
  height: 200px;
}

/* Vertical gauge */
.gauge-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  height: 100%;
}

.gauge-track {
  width: 25px;
  flex: 1;               /* fill remaining vertical space after gauge-value label */
  background: #e0ddd6;
  border: 1px solid #ccc;
  display: flex;
  align-items: flex-end;
}

.gauge-fill {
  width: 100%;
  background: #1a1a1a;
  transition: height 0.2s ease;
  min-height: 2px;
}

.gauge-value {
  font-family: 'Courier New', monospace;
  font-size: 14px;      /*Changing font size on gauge affets button volume button sizes, it shares the fixed  */
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
  color: #aaa;
  letter-spacing: 0.05em;
}

/* Controls */
.mic-controls {
   display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 4px;
  flex: 1;
  height: 100%;
}

.level-btn {
  flex: 1;
  width: 100%;
  padding: 8px 0;
  background: #fff;
  border: 1px solid #ddd;
  color: #555;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.15s;
  -webkit-tap-highlight-color: transparent;
}

.level-btn:active {
  background: #eee;
}

.mic-mute-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  width: 100%;
  flex: 1;
  padding: 10px 0;
  background: #fff;
  border: 1px solid #4caf50;
  color: #4caf50;
  cursor: pointer;
  transition: all 0.15s;
  -webkit-tap-highlight-color: transparent;
}

.mic-mute-btn.muted {
  background: #c0504d;
  border-color: #c0504d;
  color: #fff;
}

.mic-mute-btn:active {
  opacity: 0.7;
}

.mute-icon {
  font-size: 24px;
  line-height: 1;
}

.mute-label {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
</style>
