<template>
  <RouterView :system-online="systemOnline" />
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
</style>
