<template>
  <div class="mic-control">
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
        <span class="global-icon">{{ globalMuted ? '✕' : '' }}</span>
        <span class="global-btn-label">{{ globalMuted ? 'Unmute All' : 'Mute All' }}</span>
      </button>
    </div>  

    <!-- Per channel -->
    <div class="mic-grid">
      <div
        v-for="(mic, index) in mics"
        :key="index"
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
            <button class="level-btn" @click="levelUp(index)">
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
            <button class="level-btn" @click="levelDown(index)">
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
import { pulse } from '../useCrComLib';

const MIC_JOINS = {
  mute:      [JOINS.digital.mic1Mute,      JOINS.digital.mic2Mute,      JOINS.digital.mic3Mute,      JOINS.digital.mic4Mute,      JOINS.digital.mic5Mute     ],
  muteFb:    [JOINS.digital.mic1MuteFb,    JOINS.digital.mic2MuteFb,    JOINS.digital.mic3MuteFb,    JOINS.digital.mic4MuteFb,    JOINS.digital.mic5MuteFb   ],
  levelUp:   [JOINS.digital.mic1LevelUp,   JOINS.digital.mic2LevelUp,   JOINS.digital.mic3LevelUp,   JOINS.digital.mic4LevelUp,   JOINS.digital.mic5LevelUp  ],
  levelDown: [JOINS.digital.mic1LevelDown, JOINS.digital.mic2LevelDown, JOINS.digital.mic3LevelDown, JOINS.digital.mic4LevelDown, JOINS.digital.mic5LevelDown],
  label:     [JOINS.serial.mic1Label,      JOINS.serial.mic2Label,      JOINS.serial.mic3Label,      JOINS.serial.mic4Label,      JOINS.serial.mic5Label     ],
  level:     [JOINS.analog.mic1Level,      JOINS.analog.mic2Level,      JOINS.analog.mic3Level,      JOINS.analog.mic4Level,      JOINS.analog.mic5Level     ],
};
  
export default defineComponent({
  name: 'MicControl',
  setup() {
    const globalMuted = ref(false);

    const mics = reactive(
      Array.from({ length: 5 }, () => ({ muted: false, label: '', level: 0 }))
    );

    const subs: Array<{ type: 'b' | 'n' | 's'; join: string; id: string }> = [];
    const sub = (type: 'b' | 'n' | 's', join: string, cb: (v: any) => void) => {
      const id = window.CrComLib.subscribeState(type, join, cb);
      subs.push({ type, join, id });
    };

    onMounted(() => {
      sub('b', JOINS.digital.micGlobalMuteFb, (v: boolean) => globalMuted.value = v);

      mics.forEach((_, i) => {
        sub('b', MIC_JOINS.muteFb[i],  (v: boolean) => mics[i].muted = v);
        sub('s', MIC_JOINS.label[i],   (v: string)  => mics[i].label = v);
        sub('n', MIC_JOINS.level[i],   (v: number)  => mics[i].level = v);
      });

      onUnmounted(() => {
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

    return { globalMuted, mics, toggleGlobalMute, toggleMic, levelUp, levelDown };
  }
});
</script>

<style scoped>
.mic-control {
  padding: 24px 32px;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
}

.section-title {
  font-family: 'Courier New', monospace;
  font-size: 11px;
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
  border: 1px solid #ddd;
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
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}


.global-mute-btn.muted .global-icon {
  color: #fff;
}

.global-label {
  font-family: 'Georgia', serif;
  font-size: 16px;
  color: #1a1a1a;
}

.global-mute-btn.muted .global-label {
  color: #fff;
}

.global-action {
  font-family: 'Courier New', monospace;
  font-size: 10px;
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
}

.mic-channel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 12px;
  background: #f0ede6;
  border: 1px solid #ddd;
  min-width: 140px;
}

.mic-header {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.mic-number {
  font-family: 'Courier New', monospace;
  font-size: 10px;
  letter-spacing: 0.2em;
  color: #aaa;
  text-transform: uppercase;
}

.mic-name {
  font-family: 'Georgia', serif;
  font-size: 14px;
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
  width: 14px;
  flex: 1;               /* fill remaining space after gauge-value label */
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
  font-size: 9px;
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
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
  -webkit-tap-highlight-color: transparent;
}

.level-btn:active {
  background: #eee;
}

.mic-mute-btn {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  width: 100%;
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
  font-size: 16px;
  line-height: 1;
}

.mute-label {
  font-family: 'Courier New', monospace;
  font-size: 9px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
</style>