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
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
