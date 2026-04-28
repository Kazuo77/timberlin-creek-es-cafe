<template>
    <div class="cd-section">
      <h2 class="section-title">Blu-Ray</h2>

      <div class="cd-track-info" v-if="cdTrackInfo">
        <span class="cd-track-label">Now Playing</span>
        <span class="cd-track-text">{{ cdTrackInfo }}</span>
      </div>

      <div class="cd-transport">

        <!-- Source selection -->
        <div class="cd-group">
          <span class="cd-label">Source</span>
          <div class="cd-btns">
            <button class="cd-btn" :class="{ active: cdSrcCdFb }" @click="pulse(JOINS.digital.cdSrcCd)">CD</button>
            <button class="cd-btn" :class="{ active: cdSrcBtFb }" @click="pulse(JOINS.digital.cdSrcBt)">BT</button>
            <button class="cd-btn" :class="{ active: cdSrcAuxFb }" @click="pulse(JOINS.digital.cdSrcAux)">AUX</button>
          </div>
        </div>

        <div class="cd-divider"></div>

        <!-- Transport -->
        <div class="cd-group">
          <span class="cd-label">Transport</span>
          <div class="cd-btns">
            <button class="cd-btn" :class="{ active: cdPlayFb }" @click="pulse(JOINS.digital.cdPlay)">
              <span class="cd-icon">▶</span>
            </button>
            <button class="cd-btn" :class="{ active: cdPauseFb }" @click="pulse(JOINS.digital.cdPause)">
              <span class="cd-icon pause-icon">||</span>
            </button>
            <button class="cd-btn" :class="{ active: cdStopFb }" @click="pulse(JOINS.digital.cdStop)">
              <span class="cd-icon">■</span>
            </button>
          </div>
        </div>

        <div class="cd-divider"></div>

        <!-- Search — hold behavior -->
        <div class="cd-group">
          <span class="cd-label">Search</span>
          <div class="cd-btns">
            <button
              class="cd-btn"
              :class="{ active: cdSearchRevFb }"
              @pointerdown="hold(JOINS.digital.cdSearchRev, true)"
              @pointerup="hold(JOINS.digital.cdSearchRev, false)"
              @pointerleave="hold(JOINS.digital.cdSearchRev, false)"
              @pointercancel="hold(JOINS.digital.cdSearchRev, false)"
            >
              <span class="cd-icon">⏮</span>
            </button>
            <button
              class="cd-btn"
              :class="{ active: cdSearchFwdFb }"
              @pointerdown="hold(JOINS.digital.cdSearchFwd, true)"
              @pointerup="hold(JOINS.digital.cdSearchFwd, false)"
              @pointerleave="hold(JOINS.digital.cdSearchFwd, false)"
              @pointercancel="hold(JOINS.digital.cdSearchFwd, false)"
            >
              <span class="cd-icon">⏭</span>
            </button>
          </div>
        </div>

      </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { JOINS } from '../joins';
import { pulse, hold } from '../useCrComLib';

export default defineComponent({
  name: 'CDTransportControl',
  setup() {
    const cdStopFb      = ref(false);
    const cdPlayFb      = ref(false);
    const cdPauseFb     = ref(false);
    const cdSearchFwdFb = ref(false);
    const cdSearchRevFb = ref(false);
    const cdSrcCdFb     = ref(false);
    const cdSrcBtFb     = ref(false);
    const cdSrcAuxFb    = ref(false);
    const cdTrackInfo   = ref('');

    const subs: Array<{ type: 'b' | 'n' | 's'; join: string; id: string }> = [];
    const sub = (type: 'b' | 'n' | 's', join: string, cb: (v: any) => void) => {
      const id = window.CrComLib.subscribeState(type, join, cb);
      subs.push({ type, join, id });
    };

    onMounted(() => {
      sub('b', JOINS.digital.cdStopFb,      (v: boolean) => cdStopFb.value      = v);
      sub('b', JOINS.digital.cdPlayFb,      (v: boolean) => cdPlayFb.value      = v);
      sub('b', JOINS.digital.cdPauseFb,     (v: boolean) => cdPauseFb.value     = v);
      sub('b', JOINS.digital.cdSearchFwdFb, (v: boolean) => cdSearchFwdFb.value = v);
      sub('b', JOINS.digital.cdSearchRevFb, (v: boolean) => cdSearchRevFb.value = v);
      sub('b', JOINS.digital.cdSrcCdFb,     (v: boolean) => cdSrcCdFb.value     = v);
      sub('b', JOINS.digital.cdSrcBtFb,     (v: boolean) => cdSrcBtFb.value     = v);
      sub('b', JOINS.digital.cdSrcAuxFb,    (v: boolean) => cdSrcAuxFb.value    = v);
      sub('s', JOINS.serial.cdTrackInfo,    (v: string)  => cdTrackInfo.value   = v);
    });

    onUnmounted(() => {
      subs.forEach(({ type, join, id }) =>
        window.CrComLib.unsubscribeState(type, join, id)
      );
    });

    return {
      JOINS, pulse, hold,
      cdStopFb, cdPlayFb, cdPauseFb, cdSearchFwdFb, cdSearchRevFb,
      cdSrcCdFb, cdSrcBtFb, cdSrcAuxFb, cdTrackInfo,
    };
  }
});
</script>

<style scoped>
.cd-section { margin-top: 8px; }

.section-title {
  font-family: 'Courier New', monospace;
  font-size: 11px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #aaa;
  margin: 0 0 28px 0;
  font-weight: normal;
  margin-top: 32px;
}

.cd-track-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: #1a1a1a;
  color: #f7f6f2;
  margin-bottom: 2px;
}

.cd-track-label {
  font-family: 'Courier New', monospace;
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #1a1a1a;
  flex-shrink: 0;
}

.cd-track-text {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #f7f6f2;
}

.cd-transport {
  background: #f0ede6;
  border: 1px solid #ddd;
  border-left: 3px solid #1a1a1a;
  padding: 20px 24px;
  display: flex;
  align-items: flex-end;
  gap: 20px;
  flex-wrap: wrap;
}

.cd-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cd-label {
  font-family: 'Courier New', monospace;
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #888;
}

.cd-btns {
  display: flex;
  gap: 4px;
}

.cd-btn {
  padding: 25px 35px;
  background: #fff;
  border: 1px solid #ddd;
  color: #1a1a1a;
  font-family: 'Courier New', monospace;
  font-size: 18px;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all 0.15s;
  -webkit-tap-highlight-color: transparent;
  min-width: 56px;
  text-align: center;
}

.cd-btn.active {
  background: #1a1a1a;
  border-color: #1a1a1a;
  color: #f7f6f2;
}

.cd-btn:active:not(.active) { background: #eee; }

.cd-icon {
  font-size: 18px;
  line-height: 1;
}

.pause-icon {
  letter-spacing: -2px;
  font-weight: bolder;
  font-size: 21px;
}

.cd-divider {
  width: 1px;
  height: 48px;
  background: #ccc;
  align-self: flex-end;
}
</style>
