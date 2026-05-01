<template>
  <div class="blu-ray-section">
    <h2 class="section-title">Blu-Ray</h2>

    <!-- Now Playing info -->
    <div class="blu-ray-track-info" v-if="brCurrentTitle || brCurrentChapter">
      <span class="blu-ray-track-label">Now Playing</span>
      <span class="blu-ray-track-text">Title {{ brCurrentTitle }} / Chapter {{ brCurrentChapter }}</span>
    </div>

    <!-- Time -->
    <div class="blu-ray-track-info" v-if="brElapsedTime || brRemainTime">
      <span class="blu-ray-track-text">{{ brElapsedTime }}</span>
      <span class="blu-ray-track-text">-{{ brRemainTime }}</span>
    </div>

    <div class="blu-ray-transport">

      <!-- Power -->
      <div class="blu-ray-group">
        <span class="blu-ray-label">Power</span>
        <div class="blu-ray-btns">
          <button class="blu-ray-btn" :class="{ active: brPowerOnFb }" @click="pulse(JOINS.digital.brPowerOn)">On</button>
          <button class="blu-ray-btn" :class="{ active: brPowerOffFb }" @click="pulse(JOINS.digital.brPowerOff)">Off</button>
        </div>
      </div>

      <div class="blu-ray-divider"></div>

      <!-- Skip Chapter -->
      <div class="blu-ray-group">
        <span class="blu-ray-label">Chapter</span>
        <div class="blu-ray-btns">
          <button class="blu-ray-btn" @click="pulse(JOINS.digital.brChapterSkipRev)">⏮</button>
          <button class="blu-ray-btn" @click="pulse(JOINS.digital.brChapterSkipFwd)">⏭</button>
        </div>
      </div>

      <div class="blu-ray-divider"></div>
      

      <!-- Transport -->
      <div class="blu-ray-group">
        <span class="blu-ray-label">Transport</span>
        <div class="blu-ray-btns">
          <button
            class="blu-ray-btn"
            :class="{ active: brSearchRevFb }"
            @pointerdown="hold(JOINS.digital.brSearchRev, true)"
            @pointerup="hold(JOINS.digital.brSearchRev, false)"
            @pointerleave="hold(JOINS.digital.brSearchRev, false)"
            @pointercancel="hold(JOINS.digital.brSearchRev, false)"
          >◀◀</button>
          <button class="blu-ray-btn" :class="{ active: brPlayingFb }" @click="pulse(JOINS.digital.brPlay)">
            <span class="blu-ray-icon">▶</span>
          </button>
          <button class="blu-ray-btn" :class="{ active: brPausedFb }" @click="pulse(JOINS.digital.brPause)">
            <span class="blu-ray-icon pause-icon">||</span>
          </button>
          <button class="blu-ray-btn" :class="{ active: brStoppedFb }" @click="pulse(JOINS.digital.brStop)">
            <span class="blu-ray-icon">■</span>
          </button>
          <button
            class="blu-ray-btn"
            :class="{ active: brSearchFwdFb }"
            @pointerdown="hold(JOINS.digital.brSearchFwd, true)"
            @pointerup="hold(JOINS.digital.brSearchFwd, false)"
            @pointerleave="hold(JOINS.digital.brSearchFwd, false)"
            @pointercancel="hold(JOINS.digital.brSearchFwd, false)"
          >▶▶</button>
        </div>
      </div>

      <div class="blu-ray-divider"></div>


      <!-- Skip Title -->
      <div class="blu-ray-group">
        <span class="blu-ray-label">Title</span>
        <div class="blu-ray-btns">
          <button class="blu-ray-btn" @click="pulse(JOINS.digital.brTitleSkipRev)">⏮</button>
          <button class="blu-ray-btn" @click="pulse(JOINS.digital.brTitleSkipFwd)">⏭</button>
        </div>
      </div>

      <div class="blu-ray-divider"></div>

      <!-- Disc Tray -->
      <div class="blu-ray-group">
        <span class="blu-ray-label">Disc</span>
        <div class="blu-ray-btns">
          <button class="blu-ray-btn" :class="{ active: brTrayOpenFb }" @click="pulse(JOINS.digital.brTrayOpen)">Open</button>
          <button class="blu-ray-btn" :class="{ active: brTrayClosedFb }" @click="pulse(JOINS.digital.brTrayClose)">Close</button>
        </div>
      </div>

      <div class="blu-ray-divider"></div>

      <div class="blu-ray-menus">
            <button class="blu-ray-btn blu-ray-menu" @click="pulse(JOINS.digital.brHomeMenu)">⌂</button>
            <button class="blu-ray-btn blu-ray-menu" @click="pulse(JOINS.digital.brSetupMenu)">⚙</button>
            <button class="blu-ray-btn blu-ray-menu" @click="pulse(JOINS.digital.brTopMenu)">☰</button>
            <button class="blu-ray-btn blu-ray-menu" @click="pulse(JOINS.digital.brOptionMenu)">⋮</button>
            <button class="blu-ray-btn blu-ray-menu" @click="pulse(JOINS.digital.brPopupMenu)">⧉</button>
        </div>
      <div class="blu-ray-divider"></div>

      <!-- D-Pad -->
      <div class="blu-ray-group blu-ray-transports">
        <span class="blu-ray-label">Navigation</span>
        <div class="blu-ray-dpad">
          <button class="blu-ray-btn dpad-up" @click="pulse(JOINS.digital.brCursorUp)">▲</button>
          <div class="dpad-mid">
            <button class="blu-ray-btn dpad-left" @click="pulse(JOINS.digital.brCursorLeft)">◀</button>
            <button class="blu-ray-btn dpad-enter" @click="pulse(JOINS.digital.brEnter)">OK</button>
            <button class="blu-ray-btn dpad-right" @click="pulse(JOINS.digital.brCursorRight)">▶</button>
          </div>
          <button class="blu-ray-btn dpad-down" @click="pulse(JOINS.digital.brCursorDown)">▼</button>
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
    
      const brPowerOnFb       = ref(false);
      const brPowerOffFb      = ref(false);
      const brPlayingFb       = ref(false);
      const brPausedFb        = ref(false);
      const brStoppedFb       = ref(false);
      const brSearchFwdFb     = ref(false);
      const brSearchRevFb     = ref(false);
      const brSetupFb         = ref(false);
      const brHomeFb          = ref(false);
      const brMediaCenterFb   = ref(false);
      const brMenuFb          = ref(false);
      const brTrayOpenFb      = ref(false);
      const brTrayClosedFb    = ref(false);
      const brDiscPresentFb   = ref(false);
      const brDiscErrorFb     = ref(false);
      const brMuteOnFb        = ref(false);
      const brMuteOffFb       = ref(false);
      const brOsdHiddenFb     = ref(false);
      const brOsdVisibleFb    = ref(false);
      const brAspect169FullFb = ref(false);
      const brAspect169NormFb = ref(false);
      const brAspect43PanFb   = ref(false);
      const brAspect43LetterFb = ref(false);
      const brColorRgbFb      = ref(false);
      const brColorFullRgbFb  = ref(false);
      const brColorYCbCr444Fb = ref(false);
      const brColorYCbCr422Fb = ref(false);
      const brDeepColor48Fb   = ref(false);
      const brDeepColor36Fb   = ref(false);
      const brDeepColor30Fb   = ref(false);
      const brDeepColorOffFb  = ref(false);
      const brDolbyAutoFb     = ref(false);
      const brDolbyLLFb       = ref(false);
      const brDolbyLLRgbFb    = ref(false);
      const brDolbyOffFb      = ref(false);
      const brHdrAutoFb       = ref(false);
      const brHdrHdrFb        = ref(false);
      const brHdrSdrFb        = ref(false);
      const brEqOffFb         = ref(false);
      const brEqRockFb        = ref(false);
      const brEqPopFb         = ref(false);
      const brEqLiveFb        = ref(false);
      const brEqDanceFb       = ref(false);
      const brEqClassicalFb   = ref(false);
      const brEqSoftFb        = ref(false);
      const brDownmixOffFb    = ref(false);
      const brDownmixDhFb     = ref(false);
      const brDownmixDvsFb    = ref(false);
      const brDownmixMvsFb    = ref(false);
      const brResAutoFb       = ref(false);
      const brRes480iFb       = ref(false);
      const brRes480pFb       = ref(false);
      const brRes720pFb       = ref(false);
      const brRes1080iFb      = ref(false);
      const brRes1080pFb      = ref(false);
      const brRes2160pFb      = ref(false);

      // Serial
      const brElapsedTime     = ref('');
      const brRemainTime      = ref('');
      const brDiscStatus      = ref('');
      const brTransportStatus = ref('');
      const brCurrentChapter  = ref('');
      const brTotalChapters   = ref('');
      const brCurrentTitle    = ref('');
      const brTotalTitles     = ref('');
          
    const subs: Array<{ type: 'b' | 'n' | 's'; join: string; id: string }> = [];
    const sub = (type: 'b' | 'n' | 's', join: string, cb: (v: any) => void) => {
      const id = window.CrComLib.subscribeState(type, join, cb);
      subs.push({ type, join, id });
    };

    onMounted(() => {

        sub('b', JOINS.digital.brPowerOnFb,       (v: boolean) => brPowerOnFb.value       = v);
        sub('b', JOINS.digital.brPowerOffFb,      (v: boolean) => brPowerOffFb.value      = v);
        sub('b', JOINS.digital.brPlayingFb,       (v: boolean) => brPlayingFb.value       = v);
        sub('b', JOINS.digital.brPausedFb,        (v: boolean) => brPausedFb.value        = v);
        sub('b', JOINS.digital.brStoppedFb,       (v: boolean) => brStoppedFb.value       = v);
        sub('b', JOINS.digital.brSearchFwdFb,     (v: boolean) => brSearchFwdFb.value     = v);
        sub('b', JOINS.digital.brSearchRevFb,     (v: boolean) => brSearchRevFb.value     = v);
        sub('b', JOINS.digital.brSetupFb,         (v: boolean) => brSetupFb.value         = v);
        sub('b', JOINS.digital.brHomeFb,          (v: boolean) => brHomeFb.value          = v);
        sub('b', JOINS.digital.brMediaCenterFb,   (v: boolean) => brMediaCenterFb.value   = v);
        sub('b', JOINS.digital.brMenuFb,          (v: boolean) => brMenuFb.value          = v);
        sub('b', JOINS.digital.brTrayOpenFb,      (v: boolean) => brTrayOpenFb.value      = v);
        sub('b', JOINS.digital.brTrayClosedFb,    (v: boolean) => brTrayClosedFb.value    = v);
        sub('b', JOINS.digital.brDiscPresentFb,   (v: boolean) => brDiscPresentFb.value   = v);
        sub('b', JOINS.digital.brDiscErrorFb,     (v: boolean) => brDiscErrorFb.value     = v);
        sub('b', JOINS.digital.brMuteOnFb,        (v: boolean) => brMuteOnFb.value        = v);
        sub('b', JOINS.digital.brMuteOffFb,       (v: boolean) => brMuteOffFb.value       = v);
        sub('b', JOINS.digital.brOsdHiddenFb,     (v: boolean) => brOsdHiddenFb.value     = v);
        sub('b', JOINS.digital.brOsdVisibleFb,    (v: boolean) => brOsdVisibleFb.value    = v);
        sub('b', JOINS.digital.brAspect169FullFb, (v: boolean) => brAspect169FullFb.value = v);
        sub('b', JOINS.digital.brAspect169NormFb, (v: boolean) => brAspect169NormFb.value = v);
        sub('b', JOINS.digital.brAspect43PanFb,   (v: boolean) => brAspect43PanFb.value   = v);
        sub('b', JOINS.digital.brAspect43LetterFb,(v: boolean) => brAspect43LetterFb.value = v);
        sub('b', JOINS.digital.brColorRgbFb,      (v: boolean) => brColorRgbFb.value      = v);
        sub('b', JOINS.digital.brColorFullRgbFb,  (v: boolean) => brColorFullRgbFb.value  = v);
        sub('b', JOINS.digital.brColorYCbCr444Fb, (v: boolean) => brColorYCbCr444Fb.value = v);
        sub('b', JOINS.digital.brColorYCbCr422Fb, (v: boolean) => brColorYCbCr422Fb.value = v);
        sub('b', JOINS.digital.brDeepColor48Fb,   (v: boolean) => brDeepColor48Fb.value   = v);
        sub('b', JOINS.digital.brDeepColor36Fb,   (v: boolean) => brDeepColor36Fb.value   = v);
        sub('b', JOINS.digital.brDeepColor30Fb,   (v: boolean) => brDeepColor30Fb.value   = v);
        sub('b', JOINS.digital.brDeepColorOffFb,  (v: boolean) => brDeepColorOffFb.value  = v);
        sub('b', JOINS.digital.brDolbyAutoFb,     (v: boolean) => brDolbyAutoFb.value     = v);
        sub('b', JOINS.digital.brDolbyLLFb,       (v: boolean) => brDolbyLLFb.value       = v);
        sub('b', JOINS.digital.brDolbyLLRgbFb,    (v: boolean) => brDolbyLLRgbFb.value    = v);
        sub('b', JOINS.digital.brDolbyOffFb,      (v: boolean) => brDolbyOffFb.value      = v);
        sub('b', JOINS.digital.brHdrAutoFb,       (v: boolean) => brHdrAutoFb.value       = v);
        sub('b', JOINS.digital.brHdrHdrFb,        (v: boolean) => brHdrHdrFb.value        = v);
        sub('b', JOINS.digital.brHdrSdrFb,        (v: boolean) => brHdrSdrFb.value        = v);
        sub('b', JOINS.digital.brEqOffFb,         (v: boolean) => brEqOffFb.value         = v);
        sub('b', JOINS.digital.brEqRockFb,        (v: boolean) => brEqRockFb.value        = v);
        sub('b', JOINS.digital.brEqPopFb,         (v: boolean) => brEqPopFb.value         = v);
        sub('b', JOINS.digital.brEqLiveFb,        (v: boolean) => brEqLiveFb.value        = v);
        sub('b', JOINS.digital.brEqDanceFb,       (v: boolean) => brEqDanceFb.value       = v);
        sub('b', JOINS.digital.brEqClassicalFb,   (v: boolean) => brEqClassicalFb.value   = v);
        sub('b', JOINS.digital.brEqSoftFb,        (v: boolean) => brEqSoftFb.value        = v);
        sub('b', JOINS.digital.brDownmixOffFb,    (v: boolean) => brDownmixOffFb.value    = v);
        sub('b', JOINS.digital.brDownmixDhFb,     (v: boolean) => brDownmixDhFb.value     = v);
        sub('b', JOINS.digital.brDownmixDvsFb,    (v: boolean) => brDownmixDvsFb.value    = v);
        sub('b', JOINS.digital.brDownmixMvsFb,    (v: boolean) => brDownmixMvsFb.value    = v);
        sub('b', JOINS.digital.brResAutoFb,       (v: boolean) => brResAutoFb.value       = v);
        sub('b', JOINS.digital.brRes480iFb,       (v: boolean) => brRes480iFb.value       = v);
        sub('b', JOINS.digital.brRes480pFb,       (v: boolean) => brRes480pFb.value       = v);
        sub('b', JOINS.digital.brRes720pFb,       (v: boolean) => brRes720pFb.value       = v);
        sub('b', JOINS.digital.brRes1080iFb,      (v: boolean) => brRes1080iFb.value      = v);
        sub('b', JOINS.digital.brRes1080pFb,      (v: boolean) => brRes1080pFb.value      = v);
        sub('b', JOINS.digital.brRes2160pFb,      (v: boolean) => brRes2160pFb.value      = v);

        // Serial feedback
        sub('s', JOINS.serial.brElapsedTime,      (v: string) => brElapsedTime.value      = v);
        sub('s', JOINS.serial.brRemainTime,       (v: string) => brRemainTime.value       = v);
        sub('s', JOINS.serial.brDiscStatus,       (v: string) => brDiscStatus.value       = v);
        sub('s', JOINS.serial.brTransportStatus,  (v: string) => brTransportStatus.value  = v);
        sub('s', JOINS.serial.brCurrentChapter,   (v: string) => brCurrentChapter.value   = v);
        sub('s', JOINS.serial.brTotalChapters,    (v: string) => brTotalChapters.value    = v);
        sub('s', JOINS.serial.brCurrentTitle,     (v: string) => brCurrentTitle.value     = v);
        sub('s', JOINS.serial.brTotalTitles,      (v: string) => brTotalTitles.value      = v);

    });

    onUnmounted(() => {
      subs.forEach(({ type, join, id }) =>
        window.CrComLib.unsubscribeState(type, join, id)
      );
    });

    return {
      JOINS, pulse, hold,
      

      // Blu-Ray returns
      brPowerOnFb, brPowerOffFb,
      brPlayingFb, brPausedFb, brStoppedFb, brSearchFwdFb,brSearchRevFb,
      brSetupFb, brHomeFb, brMediaCenterFb, brMenuFb,
      brTrayOpenFb, brTrayClosedFb, brDiscPresentFb, brDiscErrorFb,
      brMuteOnFb, brMuteOffFb,
      brOsdHiddenFb, brOsdVisibleFb,
      brAspect169FullFb, brAspect169NormFb, brAspect43PanFb, brAspect43LetterFb,
      brColorRgbFb, brColorFullRgbFb, brColorYCbCr444Fb, brColorYCbCr422Fb,
      brDeepColor48Fb, brDeepColor36Fb, brDeepColor30Fb, brDeepColorOffFb,
      brDolbyAutoFb, brDolbyLLFb, brDolbyLLRgbFb, brDolbyOffFb,
      brHdrAutoFb, brHdrHdrFb, brHdrSdrFb,
      brEqOffFb, brEqRockFb, brEqPopFb, brEqLiveFb, brEqDanceFb, brEqClassicalFb, brEqSoftFb,
      brDownmixOffFb, brDownmixDhFb, brDownmixDvsFb, brDownmixMvsFb,
      brResAutoFb, brRes480iFb, brRes480pFb, brRes720pFb, brRes1080iFb, brRes1080pFb, brRes2160pFb,
      brElapsedTime, brRemainTime,
      brDiscStatus, brTransportStatus,
      brCurrentChapter, brTotalChapters, brCurrentTitle, brTotalTitles,
    };
  }
});
</script>

<style scoped>
.blu-ray-section { margin-top: 8px; }

.section-title {
  font-family: 'Courier New', monospace;
  font-size: 15px;
  text-shadow: 2px 3px 6px rgba(0, 0, 0, 0.4);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #aaa;
  margin: 0 0 28px 0;
  font-weight: normal;
  margin-top: 32px;
}

.blu-ray-track-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: #1a1a1a;
  color: #f7f6f2;
  margin-bottom: 2px;
}

.blu-ray-track-label {
  font-family: 'Courier New', monospace;
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #1a1a1a;
  flex-shrink: 0;
}

.blu-ray-track-text {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #f7f6f2;
}

.blu-ray-transport {
  background: #f0ede6;
  border: 1px solid #ddd;
  border-left: 3px solid #1a1a1a;
  padding: 20px 24px;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  flex-wrap: wrap;
}

.blu-ray-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.blu-ray-label {
  font-family: 'Courier New', monospace;
  font-size: 16px;
  text-shadow: 4px 5px 5px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #888;
}

.blu-ray-btns {
  display: flex;
  gap: 4px;
}

.blu-ray-btn {
  padding: 25px 35px;
  background: #fff;
  border: 1px solid #ddd;
  color: #1a1a1a;
  font-family: 'Courier New', monospace;
  font-size: 24px;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all 0.15s;
  -webkit-tap-highlight-color: transparent;
  min-width: 56px;
  text-align: center;
}

.blu-ray-btn.active {
  background: #1a1a1a;
  border-color: #1a1a1a;
  color: #f7f6f2;
}

.blu-ray-btn:active:not(.active) { background: #eee; }

.blu-ray-icon {
  font-size: 24px;
  line-height: 1;
}

.pause-icon {
  letter-spacing: -2px;
  font-weight: bolder;
  font-size: 21px;
}

.blu-ray-divider {
  width: 1px;
  background: #ccc;
  align-self: stretch;
}

.blu-ray-dpad {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.dpad-mid {
  display: flex;
  gap: 4px;
}

.blu-ray-dpad .blu-ray-btn {
  width: 72px;
  height: 72px;
  padding: 0;
  min-width: unset;
  display: flex;
  align-items: center;
  justify-content: center;
}
  .blu-ray-transports {
    flex-direction: row;
  }

.blu-ray-menus {
  display: flex;
  flex-direction: row;
  align-self: center;
  gap: 4px;
}

.blu-ray-menu {
  width: 95px;
  height: 95px;
  padding: 0;
  min-width: unset;
  font-size: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
