<template>
  <div class="volume-control">
    <h2 class="section-title">Source Volume</h2>

    <div class="vol-grid">
      <div
        v-for="(source, index) in sources"
        :key="index"
        class="vol-channel"
      >
        <div class="vol-header">
          <div class="vol-number">SRC {{ index + 1 }}</div>
          <div class="vol-name">{{ source.label || `Source ${index + 1}` }}</div>
        </div>

        <div class="vol-body">
          <!-- Vertical gauge -->
          <div class="gauge-wrap">
            <div class="gauge-track">
              <div class="gauge-fill" :style="{ height: Math.round((source.level / 65535) * 100) + '%' }"></div>
            </div>
            <span class="gauge-value">{{ Math.round((source.level / 65535) * 100) }}%</span>
          </div>

          <!-- Controls -->
          <div class="vol-controls">
            <button class="level-btn" @click="levelUp(index)">
              <span>▲</span>
            </button>
            <button
              class="vol-mute-btn"
              :class="{ muted: source.muted }"
              @click="toggleMute(index)"
            >
              <span class="mute-icon">{{ source.muted ? '✕' : '◎' }}</span>
              <span class="mute-label">{{ source.muted ? 'Muted' : 'Active' }}</span>
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
import { defineComponent, reactive, onMounted, onUnmounted } from 'vue';
import { JOINS } from '../joins';
import { pulse } from '../useCrComLib';

const VOL_JOINS = {
  mute:     [JOINS.digital.volMute,    JOINS.digital.cdMute   ],
  muteFb:   [JOINS.digital.volMuteFb,  JOINS.digital.cdMuteFb ],
  up:       [JOINS.digital.volUp,      JOINS.digital.cdUp     ],
  down:     [JOINS.digital.volDown,    JOINS.digital.cdDown   ],
  level:    [JOINS.analog.volGauge,    JOINS.analog.cdGauge   ],
  label:    [JOINS.serial.vol1Label,   JOINS.serial.vol2Label ],
};

export default defineComponent({
  name: 'VolumeControl',
  setup() {
    const sources = reactive(
      Array.from({ length: 2 }, () => ({ muted: false, label: '', level: 0 }))
    );

    const subs: Array<{ type: 'b' | 'n' | 's'; join: string; id: string }> = [];
    const sub = (type: 'b' | 'n' | 's', join: string, cb: (v: any) => void) => {
      const id = window.CrComLib.subscribeState(type, join, cb);
      subs.push({ type, join, id });
    };

    onMounted(() => {
      sources.forEach((_, i) => {
        sub('b', VOL_JOINS.muteFb[i], (v: boolean) => sources[i].muted = v);
        sub('n', VOL_JOINS.level[i],  (v: number)  => sources[i].level = v);
        sub('s', VOL_JOINS.label[i],  (v: string)  => sources[i].label = v);
      });

      onUnmounted(() => {
        subs.forEach(({ type, join, id }) =>
          window.CrComLib.unsubscribeState(type, join, id)
        );
      });
    });

    const toggleMute = (index: number) => pulse(VOL_JOINS.mute[index]);
    const levelUp    = (index: number) => pulse(VOL_JOINS.up[index]);
    const levelDown  = (index: number) => pulse(VOL_JOINS.down[index]);

    return { sources, toggleMute, levelUp, levelDown };
  }
});
</script>

<style scoped>
.volume-control {
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
  margin: 0 0 28px 0;
  font-weight: normal;
}

.vol-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.vol-channel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 12px;
  background: #f0ede6;
  border: 1px solid #ddd;
  min-width: 160px;
}

.vol-header {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.vol-number {
  font-family: 'Courier New', monospace;
  font-size: 10px;
  letter-spacing: 0.2em;
  color: #aaa;
  text-transform: uppercase;
}

.vol-name {
  font-family: 'Georgia', serif;
  font-size: 14px;
  color: #1a1a1a;
  min-height: 20px;
}

.vol-body {
  display: flex;
  gap: 10px;
  align-items: stretch;
  height: 240px;
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
  flex: 1;
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
.vol-controls {
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

.vol-mute-btn {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  width: 100%;
  background: #fff;
  border: 1px solid #4caf50;
  color: #4caf50;
  cursor: pointer;
  transition: all 0.15s;
  -webkit-tap-highlight-color: transparent;
}

.vol-mute-btn.muted {
  background: #c0504d;
  border-color: #c0504d;
  color: #fff;
}

.vol-mute-btn:active {
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