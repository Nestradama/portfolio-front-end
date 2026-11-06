<script setup lang="ts">
import { computed } from 'vue'
import { useContent } from '@/composables/useContent'
import SafeText from '@/components/SafeText.vue'

const { settings } = useContent()

// `name` is kept for existing content; new content stores the whole line in `heading`.
const title = computed(() =>
  [settings.value.home.heading, settings.value.home.name].filter(Boolean).join(' '),
)
</script>

<template>
  <div id="hero-content" class="fade-in w-full transition-opacity duration-300">
    <h1 id="hero-title"
        class="font-heading text-[clamp(2.2rem,10vw,4.5rem)] font-medium mb-4 leading-[1.1] tracking-tight">
      {{ title }}
    </h1>
    <p id="hero-desc" class="text-base sm:text-lg md:text-xl text-muted max-w-[60ch] leading-relaxed font-light">
      <span
        v-for="(paragraph, index) in settings.home.paragraphs"
        :key="index"
        class="block"
        :class="{ 'mb-4': index < settings.home.paragraphs.length - 1 }"
      ><SafeText :text="paragraph" /></span>
    </p>
  </div>
</template>
