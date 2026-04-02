<template>
  <div class="source-routing">
    <h2 class="section-title">Source Routing</h2>
    <div class="outputs">

      <!-- Output 1 -->
      <div v-show="output1Visible">
        <div class="output-row">
          <button class="expand-btn" :class="{ open: disp1Open }" @click="disp1Open = !disp1Open">
            <span>{{ disp1Open ? '▴' : '▾' }}</span>
            <span class="expand-label">Display Controls</span>
          </button>
          <div class="output-label">
            <span class="output-number">OUT 1</span>
            <span class="output-name">Projector</span>
          </div>
          <div class="source-select">
            <button
              v-for="input in inputs"
              :key="input.value"
              class="source-btn"
              :class="{ active: output1Source === input.value }"
              @click="routeOutput1(input.value)"
            >
              {{ input.label }}
            </button>
          </div>
          <div class="hdcp-error" v-if="disp1HdcpErr">
            <span class="hdcp-icon">⚠</span>
            <span class="hdcp-text">HDCP Error</span>
          </div>
        </div>

        <!-- Display 1 controls -->
        <Transition name="expand">
          <div class="display-panel" v-if="disp1Open">
            <div class="ctrl-group">
              <span class="ctrl-label">Power</span>
              <div class="ctrl-btns">
                <button class="ctrl-btn" :class="{ on: disp1Power }" @click="pulse(JOINS.digital.disp1Power)">
                  {{ disp1Power ? 'On' : 'Off' }}
                </button>
              </div>
            </div>
            <div class="ctrl-divider"></div>
            <div class="ctrl-group">
              <span class="ctrl-label">Volume</span>
              <div class="ctrl-btns">
                <button class="ctrl-btn" @click="pulse(JOINS.digital.disp1VolDown)">▼</button>
                <button class="ctrl-btn" :class="{ muted: disp1Mute }" @click="pulse(JOINS.digital.disp1Mute)">
                  {{ disp1Mute ? 'Muted' : 'Active' }}
                </button>
                <button class="ctrl-btn" @click="pulse(JOINS.digital.disp1VolUp)">▲</button>
              </div>
            </div>
            <div class="ctrl-divider"></div>
            <div class="ctrl-group">
              <span class="ctrl-label">Input</span>
              <div class="ctrl-btns">
                <button class="ctrl-btn" :class="{ active: disp1Hdmi1Fb }" @click="pulse(JOINS.digital.disp1Hdmi1)">HDMI 1</button>
                <button class="ctrl-btn" :class="{ active: disp1Hdmi2Fb }" @click="pulse(JOINS.digital.disp1Hdmi2)">HDMI 2</button>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Output 2 -->
      <div v-show="output2Visible">
        <div class="output-row">
          <button class="expand-btn" :class="{ open: disp2Open }" @click="disp2Open = !disp2Open">
            <span>{{ disp2Open ? '▴' : '▾' }}</span>
            <span class="expand-label">Display Controls</span>
          </button>
          <div class="output-label">
            <span class="output-number">OUT 2</span>
            <span class="output-name">Display</span>
          </div>
          <div class="source-select">
            <button
              v-for="input in inputs"
              :key="input.value"
              class="source-btn"
              :class="{ active: output2Source === input.value }"
              @click="routeOutput2(input.value)"
            >
              {{ input.label }}
            </button>
          </div>
          <div class="hdcp-error" v-if="disp2HdcpErr">
            <span class="hdcp-icon">⚠</span>
            <span class="hdcp-text">HDCP Error</span>
          </div>
        </div>

        <!-- Display 2 controls -->
        <Transition name="expand">
          <div class="display-panel" v-if="disp2Open">
            <div class="ctrl-group">
              <span class="ctrl-label">Power</span>
              <div class="ctrl-btns">
                <button class="ctrl-btn" :class="{ on: disp2Power }" @click="pulse(JOINS.digital.disp2Power)">
                  {{ disp2Power ? 'On' : 'Off' }}
                </button>
              </div>
            </div>
            <div class="ctrl-divider"></div>
            <div class="ctrl-group">
              <span class="ctrl-label">Volume</span>
              <div class="ctrl-btns">
                <button class="ctrl-btn" @click="pulse(JOINS.digital.disp2VolDown)">▼</button>
                <button class="ctrl-btn" :class="{ muted: disp2Mute }" @click="pulse(JOINS.digital.disp2Mute)">
                  {{ disp2Mute ? 'Muted' : 'Active' }}
                </button>
                <button class="ctrl-btn" @click="pulse(JOINS.digital.disp2VolUp)">▲</button>
              </div>
            </div>
            <div class="ctrl-divider"></div>
            <div class="ctrl-group">
              <span class="ctrl-label">Input</span>
              <div class="ctrl-btns">
                <button class="ctrl-btn" :class="{ active: disp2Hdmi1Fb }" @click="pulse(JOINS.digital.disp2Hdmi1)">HDMI 1</button>
                <button class="ctrl-btn" :class="{ active: disp2Hdmi2Fb }" @click="pulse(JOINS.digital.disp2Hdmi2)">HDMI 2</button>
              </div>
            </div>
          </div>
        </Transition>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue';
import { JOINS } from '../joins';
import { pulse } from '../useCrComLib';

export default defineComponent({
  name: 'SourceRouting',
  setup() {
    const output1Source  = ref(0);
    const output2Source  = ref(0);
    const output1Visible = ref(true);
    const output2Visible = ref(true);
    const inputLabels    = ref(['', '', '', '']);

    const disp1Open = ref(false);
    const disp2Open = ref(false);

    const disp1Power   = ref(false);
    const disp1Mute    = ref(false);
    const disp1Hdmi1Fb = ref(false);
    const disp1Hdmi2Fb = ref(false);

    const disp2Power   = ref(false);
    const disp2Mute    = ref(false);
    const disp2Hdmi1Fb = ref(false);
    const disp2Hdmi2Fb = ref(false);

    const disp1HdcpErr = ref(false);
    const disp2HdcpErr = ref(false);

    const inputs = computed<Array<{ value: number; label: string }>>(() => [
      { value: 1, label: inputLabels.value[0] || 'Input 1' },
      { value: 2, label: inputLabels.value[1] || 'Input 2' },
      { value: 3, label: inputLabels.value[2] || 'Input 3' },
      { value: 4, label: inputLabels.value[3] || 'Input 4' },
    ]);

    const subs: Array<{ type: 'b' | 'n' | 's'; join: string; id: string }> = [];
    const sub = (type: 'b' | 'n' | 's', join: string, cb: (v: any) => void) => {
      const id = window.CrComLib.subscribeState(type, join, cb);
      subs.push({ type, join, id });
    };

    onMounted(() => {
      sub('n', JOINS.analog.output1SourceFb, (v: number) => { output1Source.value = v; });
      sub('n', JOINS.analog.output2SourceFb, (v: number) => { output2Source.value = v; });

      sub('s', JOINS.serial.input1Label, (v: string) => { inputLabels.value[0] = v; });
      sub('s', JOINS.serial.input2Label, (v: string) => { inputLabels.value[1] = v; });
      sub('s', JOINS.serial.input3Label, (v: string) => { inputLabels.value[2] = v; });
      sub('s', JOINS.serial.input4Label, (v: string) => { inputLabels.value[3] = v; });

      sub('b', JOINS.digital.disp1PowerFb,  (v: boolean) => { disp1Power.value   = v; });
      sub('b', JOINS.digital.disp1MuteFb,   (v: boolean) => { disp1Mute.value    = v; });
      sub('b', JOINS.digital.disp1Hdmi1Fb,  (v: boolean) => { disp1Hdmi1Fb.value = v; });
      sub('b', JOINS.digital.disp1Hdmi2Fb,  (v: boolean) => { disp1Hdmi2Fb.value = v; });

      sub('b', JOINS.digital.disp2PowerFb,  (v: boolean) => { disp2Power.value   = v; });
      sub('b', JOINS.digital.disp2MuteFb,   (v: boolean) => { disp2Mute.value    = v; });
      sub('b', JOINS.digital.disp2Hdmi1Fb,  (v: boolean) => { disp2Hdmi1Fb.value = v; });
      sub('b', JOINS.digital.disp2Hdmi2Fb,  (v: boolean) => { disp2Hdmi2Fb.value = v; });

      sub('b', JOINS.digital.disp1HdcpErr, (v: boolean) => {disp1HdcpErr.value = v;})
      sub('b', JOINS.digital.disp2HdcpErr, (v: boolean) => {disp2HdcpErr.value = v;})

      onUnmounted(() => {
        subs.forEach(({ type, join, id }) =>
          window.CrComLib.unsubscribeState(type, join, id)
        );
      });
    });

    const routeOutput1 = (inputValue: number) =>
      window.CrComLib.publishEvent('n', JOINS.analog.output1Source, inputValue);

    const routeOutput2 = (inputValue: number) =>
      window.CrComLib.publishEvent('n', JOINS.analog.output2Source, inputValue);

    return {
      JOINS, pulse,
      output1Source, output2Source,
      output1Visible, output2Visible,
      inputs, routeOutput1, routeOutput2,
      disp1Open, disp2Open,
      disp1Power, disp1Mute, disp1Hdmi1Fb, disp1Hdmi2Fb,
      disp2Power, disp2Mute, disp2Hdmi1Fb, disp2Hdmi2Fb,
      disp1HdcpErr, disp2HdcpErr,
    };
  }
});
</script>

<style scoped>
.source-routing {
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

.outputs {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.output-row {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 24px;
  background: #f0ede6;
  border-left: 3px solid #1a1a1a;
}

.expand-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 8px 12px;
  background: transparent;
  border: 1px solid #ccc;
  color: #888;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
  -webkit-tap-highlight-color: transparent;
  flex-shrink: 0;
}

.expand-btn.open {
  background: #1a1a1a;
  border-color: #1a1a1a;
  color: #f7f6f2;
}

.expand-label {
  font-size: 9px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.output-label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 80px;
}

.output-number {
  font-family: 'Courier New', monospace;
  font-size: 10px;
  letter-spacing: 0.2em;
  color: #aaa;
  text-transform: uppercase;
}

.output-name {
  font-family: 'Georgia', serif;
  font-size: 16px;
  color: #1a1a1a;
}

.source-select {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.source-btn {
  padding: 12px 28px;
  background: #fff;
  border: 1px solid #ddd;
  color: #555;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all 0.15s;
  -webkit-tap-highlight-color: transparent;
  min-width: 120px;
}

.source-btn.active {
  background: #1a1a1a;
  border-color: #1a1a1a;
  color: #f7f6f2;
}

.source-btn:active:not(.active) {
  background: #eee;
}

.display-panel {
  margin-left: 48px;
  margin-top: 2px;
  padding: 16px 40px;
  background: #e8e4dc;
  border-left: 3px solid #555;
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.ctrl-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ctrl-label {
  font-family: 'Courier New', monospace;
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #888;
}

.ctrl-btns {
  display: flex;
  gap: 4px;
}

.ctrl-btn {
  padding: 18px 28px;
  background: #fff;
  border: 1px solid #ddd;
  color: #555;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all 0.15s;
  -webkit-tap-highlight-color: transparent;
}

.ctrl-btn.active {
  background: #1a1a1a;
  border-color: #1a1a1a;
  color: #f7f6f2;
}

.ctrl-btn.on {
  background: #4caf50;
  border-color: #4caf50;
  color: #fff;
}

.ctrl-btn.muted {
  background: #c0504d;
  border-color: #c0504d;
  color: #fff;
}

.ctrl-btn:active {
  opacity: 0.7;
}

.ctrl-divider {
  width: 1px;
  height: 40px;
  background: #ccc;
  align-self: center;
}

.expand-enter-active,
.expand-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
.hdcp-error {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: #c0504d;
  color: #fff;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-left: auto;
}

.hdcp-icon {
  font-size: 14px;
}
</style>