<script setup lang="ts">
import { ref } from 'vue'
import HeroNav from './HeroNav.vue'
import HeroImage from './HeroImage.vue'
import HeroAboutMe from './HeroAboutMe.vue'
import HeroStack from './HeroStack.vue'
import HeroContact from './HeroContact.vue'

const activeTab = ref<'me' | 'stack' | 'contact'>('me')

const emit = defineEmits<{ openPrivacy: []}>()
</script>

<template>
  <section class="relative isolate mb-20 sm:mb-32 md:mb-40 mt-6 sm:mt-12 md:py-20">
    <div aria-hidden="true" class="hidden md:inline absolute inset-y-0 left-1/2 ml-[-50vw] w-screen -z-10 bg-(--card)/40"></div>
    <div class="flex flex-col md:flex-row gap-8 md:gap-12 items-start md:items-center">
      <div class="self-start flex flex-col items-start gap-6 shrink-0 w-full md:w-auto">
        <HeroImage />
        <HeroNav :active="activeTab" @select="activeTab = $event" />
      </div>
      <Transition name="fade" mode="out-in">
      <HeroAboutMe @select="activeTab = $event" v-if="activeTab === 'me'" />
      <HeroStack v-else-if="activeTab === 'stack'" />
      <HeroContact @open-privacy="emit('openPrivacy')" v-else-if="activeTab === 'contact'" />
      </Transition>
    </div>
  </section>
</template>
