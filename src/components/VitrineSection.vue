<script setup lang="ts">
import SectionHeader from "@/components/SectionHeader.vue";
import { useContent } from "@/composables/useContent";

const { vitrines } = useContent()
const headingId = 'realisations-concepts-title'
</script>

<template>
  <section class="mb-12" :aria-labelledby="headingId">
    <SectionHeader :section-name="'Realisations & Concepts'" :heading-id="headingId"></SectionHeader>
    <div class="grid grid-cols-1 gap-12 sm:gap-20">


      <article v-for="vitrine in vitrines" :key="vitrine.id" :class="[vitrine.id % 2 !== 0 ? 'md:flex-row' : 'md:flex-row-reverse', 'flex flex-col gap-0 group']">

        <div class="relative md:hidden rounded-lg overflow-hidden border border-(--border)">
          <img :src="vitrine.img" :alt="'Aperçu du projet ' + vitrine.title" class="w-full h-64 object-cover">
          <h3 class="absolute top-3 left-4 font-heading text-lg font-bold drop-shadow-md">{{ vitrine.title }}</h3>
          <div class="absolute inset-x-0 bottom-0 flex items-center gap-3 p-4 bg-black/70 backdrop-blur-[2px]">
            <p class="flex-1 text-sm text-white/95 leading-relaxed">{{ vitrine.desc }}</p>
            <a v-if="vitrine.link !== null" :href="vitrine.link" :aria-label="'Voir le site ' + vitrine.title"
               class="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/15 hover:bg-accent hover:text-black transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>
            </a>
            <span v-else role="img" :aria-label="vitrine.linkText"
                  class="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-white/50">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </span>
          </div>
        </div>

        <div class="neo-card p-8 md:p-12 w-full md:w-1/2 z-10 flex flex-col justify-center hidden md:flex">
          <h3 class="font-heading text-2xl md:text-3xl font-bold mb-4">{{vitrine.title}}</h3>
          <p class="text-sm md:text-base text-muted mb-8 leading-relaxed">{{vitrine.desc}}</p>
          <span v-if="vitrine.link === null" class="w-fit border border-(--border) py-2 px-6 font-mono text-[10px] uppercase text-gray-500 cursor-not-allowed">{{vitrine.linkText}}</span>
          <a v-if="vitrine.link !== null" :href="vitrine.link" class="w-fit border border-(--border) py-2 px-6 font-mono text-[10px] uppercase hover:bg-accent hover:text-black transition-colors">{{vitrine.linkText}} ↗</a>
        </div>

        <div class="hidden md:block w-full md:w-1/2 border border-(--border) overflow-hidden">
          <img :src="vitrine.img" :alt="'Aperçu du projet ' + vitrine.title" class="w-full h-full object-cover transition-all duration-700">
        </div>
      </article>


    </div>
  </section>
</template>
