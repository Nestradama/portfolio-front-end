<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import HeroStack from '@/components/hero/HeroStack.vue'
import HeroContact from '@/components/hero/HeroContact.vue'
import SectionHeader from '@/components/SectionHeader.vue'
import SafeText from '@/components/SafeText.vue'
import { useContent } from '@/composables/useContent'

const route = useRoute()
const emit = defineEmits<{ openPrivacy: [] }>()
const { settings } = useContent()

function scrollToHash() {
  if (!route.hash) return
  document.querySelector(route.hash)?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(scrollToHash)
watch(() => route.hash, () => requestAnimationFrame(scrollToHash))
</script>

<template>
  <section aria-labelledby="about-heading">
    <header class="mb-14 border-b border-(--border) pb-10 md:mb-20">
      <p class="mb-3 font-mono text-xs uppercase tracking-widest text-muted">À propos</p>
      <h1 id="about-heading" class="max-w-4xl font-heading text-[clamp(2rem,7vw,4.5rem)] font-bold leading-[1.05] tracking-tight">
        {{ settings.about.heading }}
      </h1>
      <div v-if="settings.sections.aboutIntro" class="mt-7 max-w-3xl space-y-4 text-base leading-relaxed text-muted sm:text-lg">
        <p v-for="(paragraph, index) in settings.about.paragraphs" :key="index"><SafeText :text="paragraph" /></p>
      </div>
    </header>

    <section class="mb-16 md:mb-24" aria-labelledby="parcours-heading">
      <SectionHeader section-name="Parcours" heading-id="parcours-heading" />
      <ol class="divide-y divide-(--border) border-y border-(--border)">
        <li class="grid gap-2 py-6 md:grid-cols-[6rem_1fr]">
          <span class="font-mono text-xs text-muted">01</span>
          <div>
            <h3 class="font-heading text-xl font-bold">STI2D</h3>
            <p class="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
              J'ai suivi un bac STI2D avant de m'orienter vers le développement.
            </p>
          </div>
        </li>
        <li class="grid gap-2 py-6 md:grid-cols-[6rem_1fr]">
          <span class="font-mono text-xs text-muted">02</span>
          <div>
            <h3 class="font-heading text-xl font-bold">Autodidacte</h3>
            <p class="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
              J'ai commencé à apprendre seul, en construisant des projets personnels et en
              m'appuyant sur la documentation.
            </p>
          </div>
        </li>
        <li class="grid gap-2 py-6 md:grid-cols-[6rem_1fr]">
          <span class="font-mono text-xs text-muted">03</span>
          <div>
            <h3 class="font-heading text-xl font-bold">OpenClassrooms</h3>
            <p class="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
              La formation webdev m'a permis de structurer mes connaissances : HTML/CSS,
              JavaScript, React, Node, API REST et travail par projets.
            </p>
          </div>
        </li>
        <li class="grid gap-2 py-6 md:grid-cols-[6rem_1fr]">
          <span class="font-mono text-xs text-muted">04</span>
          <div>
            <h3 class="font-heading text-xl font-bold">Alternance Java</h3>
            <p class="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
              Je cherche aujourd'hui une alternance Java pour travailler sur des applications
              back-end au sein d'une équipe.
            </p>
          </div>
        </li>
      </ol>
    </section>

    <section class="mb-16 md:mb-24" aria-labelledby="now-heading">
      <SectionHeader section-name="En ce moment" heading-id="now-heading" />
      <dl class="divide-y divide-(--border) border-y border-(--border)">
        <div class="grid gap-2 py-5 md:grid-cols-[8rem_1fr]">
          <dt class="font-mono text-xs uppercase tracking-widest text-muted">Formation</dt>
          <dd class="max-w-3xl text-sm leading-relaxed text-muted">
            Je suis en formation webdev chez OpenClassrooms.
          </dd>
        </div>
        <div class="grid gap-2 py-5 md:grid-cols-[8rem_1fr]">
          <dt class="font-mono text-xs uppercase tracking-widest text-muted">Projets</dt>
          <dd class="max-w-3xl text-sm leading-relaxed text-muted">
            Je continue à développer Marketframe et SRT Engrave, et je maintiens ce site.
          </dd>
        </div>
        <div class="grid gap-2 py-5 md:grid-cols-[8rem_1fr]">
          <dt class="font-mono text-xs uppercase tracking-widest text-muted">Recherche</dt>
          <dd class="max-w-3xl text-sm leading-relaxed text-muted">
            Je cherche une alternance Java pour travailler sur des applications back-end.
          </dd>
        </div>
      </dl>
    </section>

    <section class="mb-16 md:mb-24" aria-labelledby="objectif-heading">
      <SectionHeader section-name="Objectif" heading-id="objectif-heading" />
      <div class="max-w-3xl space-y-4 text-sm leading-relaxed text-muted sm:text-base">
        <p>
          Je cherche une alternance Java avec Spring pour travailler sur des API et des données.
        </p>
        <p>
          Je veux progresser sur l'architecture, les tests, la CI/CD et les bases de Docker.
          Je continue aussi à développer des projets personnels pour mettre ces sujets en pratique.
        </p>
      </div>
    </section>

    <section v-if="settings.sections.aboutStack" id="stack" class="mb-16 scroll-mt-24 md:mb-24" aria-labelledby="stack-heading">
      <SectionHeader section-name="Stack" heading-id="stack-heading" />
      <HeroStack heading-level="h2" />
    </section>

    <section v-if="settings.sections.aboutContact" id="contact" class="scroll-mt-24" aria-labelledby="contact-heading">
      <SectionHeader section-name="Contact" heading-id="contact-heading" />
      <p class="mb-8 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
        Une offre d'alternance, un projet à discuter, ou simplement une question ? Écris-moi.
      </p>
      <HeroContact heading-level="h2" @open-privacy="emit('openPrivacy')" />
    </section>
  </section>
</template>
