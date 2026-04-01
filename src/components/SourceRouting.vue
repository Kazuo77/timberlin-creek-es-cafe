<template>
  <div class="source-routing">
    <h2 class="section-title">Source Routing</h2>
    <div class="outputs">
      <!-- Output 1 -->
      <div class="output-row" v-show="output1Visible">
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
      </div>

      <!-- Output 2 -->
      <div class="output-row" v-show="output2Visible">
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
            @click="routeOutput2(input.value as number)"
          >
            {{ input.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue';
import { JOINS } from '../joins';

export default defineComponent({
  name: 'SourceRouting',
  setup() {
    const output1Source  = ref(0);
    const output2Source  = ref(0);
    const output1Visible = ref(true);
    const output2Visible = ref(true);
    const inputLabels    = ref(['', '', '', '']);

    const inputs = computed(() => [
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
      console.log('inputs:', inputs.value);
      sub('n', JOINS.analog.output1SourceFb,   (v: number)  => { output1Source.value  = v; });
      sub('n', JOINS.analog.output2SourceFb,   (v: number)  => { output2Source.value  = v; });
      //sub('b', JOINS.digital.OUTPUT_1_VISIBLE, (v: boolean) => { output1Visible.value = v; });
      //sub('b', JOINS.digital.OUTPUT_2_VISIBLE, (v: boolean) => { output2Visible.value = v; });
      sub('s', JOINS.serial.input1Label,     (v: string)  => { inputLabels.value[0] = v; });
      sub('s', JOINS.serial.input2Label,     (v: string)  => { inputLabels.value[1] = v; });
      sub('s', JOINS.serial.input3Label,     (v: string)  => { inputLabels.value[2] = v; });
      sub('s', JOINS.serial.input4Label,     (v: string)  => { inputLabels.value[3] = v; });
    });

    onUnmounted(() => {
      subs.forEach(({ type, join, id }) =>
        window.CrComLib.unsubscribeState(type, join, id)
      );
    });

    const routeOutput1 = (inputValue: number) =>
      window.CrComLib.publishEvent('n', JOINS.analog.output1Source, inputValue);

    const routeOutput2 = (inputValue: number) =>
      window.CrComLib.publishEvent('n', JOINS.analog.output2Source, inputValue);

    return {
      output1Source, output2Source,
      output1Visible, output2Visible,
      inputs, routeOutput1, routeOutput2
    };
  }
});
</script>

<style scoped>
.source-routing {
  padding: 24px 32px;
  height: 100%;
  box-sizing: border-box;
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
  gap: 24px;
}

.output-row {
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 20px 24px;
  background: #f0ede6;
  border-left: 3px solid #1a1a1a;
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
</style>