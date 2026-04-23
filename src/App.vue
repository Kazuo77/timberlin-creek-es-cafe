<template>
  <div class="panel-root">
    <RouterView :system-online="systemOnline" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import useWebXPanel from './composables/useWebXPanel';
import { webXPanelConfig } from './webxpanel.config';

export default defineComponent({
  setup() {
    const { systemOnline } = useWebXPanel(webXPanelConfig);
    return { systemOnline };
  }
});
</script>
<style>
html, body {
  overflow: hidden;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
}

.panel-root {
  width: 1280px;
  height: 800px;
  overflow: hidden;
}

@media (orientation: portrait) {
  .panel-root {
    position: fixed;
    top: 50%;
    left: 50%;
    transform:
      translate(-50%, -50%)
      rotate(90deg)
      scale(min(calc(100vw / 800px), calc(100vh / 1280px)));
  }
}
</style>
