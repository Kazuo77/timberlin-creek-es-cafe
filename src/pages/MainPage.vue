<template>
  <div class="main-page">
    <TopBar :system-online="systemOnline" />

    <div class="content">
      <Transition name="fade" mode="out-in">
        <SourceRouting v-if="activeSection === 'routing'" key="routing" />
        <VolumeControl v-else-if="activeSection === 'volume'" key="volume" />
        <MicControl    v-else-if="activeSection === 'mics'"   key="mics" />
      </Transition>
    </div>

    <BottomNav :active-section="activeSection" @section="activeSection = $event" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, toRefs } from 'vue';
import TopBar        from '../components/TopBar.vue';
import BottomNav     from '../components/BottomNav.vue';
import SourceRouting from '../components/SourceRouting.vue';
import VolumeControl from '../components/VolumeControl.vue';
import MicControl    from '../components/MicControl.vue';
//import { JOINS }     from '../joins';
//import { useRouter } from 'vue-router';
//import { webXPanelConfig } from '../webxpanel.config';


export default defineComponent({
  name: 'MainPage',
  components: { TopBar, BottomNav, SourceRouting, VolumeControl, MicControl },
  props: {
    systemOnline: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const activeSection = ref<'routing' | 'volume' | 'mics'>('routing');
    const { systemOnline} = toRefs(props);
    

    onMounted(() => {
      // Listen for digital, analog, and serial joins 1 from the control system.
      // only used to unsubscribe from the join when the component unmounts
      
      onUnmounted(() => {
      //window.CrComLib.unsubscribeState('b', JOINS.digital.shutdownFb, shutdownSubId);
      
    });
    });

    

    return { activeSection, systemOnline };
  }
});
</script>

<style scoped>
.main-page {
  width: 1280px;
  height: 800px;
  background: #f7f6f2;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Georgia', serif;
}

.content {
  flex: 1;
  overflow: hidden;
  position: relative;
}

/* Section transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
