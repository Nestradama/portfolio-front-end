<script setup lang="ts">
const emit = defineEmits<{ select: [tab: 'me' | 'stack' | 'contact'] }>()

</script>

<template>
  <div id="hero-content" class="fade-in w-full transition-opacity duration-300">
    <h1 id="hero-title"
        class="font-heading text-[clamp(2.2rem,10vw,4.5rem)] font-medium mb-4 leading-[1.1] tracking-tight">
      Salut, moi c'est <br class="block md:hidden"/><span class="font-bold">Corentin</span>.
    </h1>
    <p id="hero-desc" class="text-base sm:text-lg md:text-xl text-muted max-w-[60ch] leading-relaxed font-light">
      <span class="block mb-4">Back-end de préférence, et pas mal de projets perso parce que c'est comme ça que j'apprends. Autodidacte, en formation webdev (OpenClassrooms), je vise une alternance Java.</span>
      <span class="block">Si vous avez des projets qui ont besoin de solutions, n'hésitez pas à me <button
          @click="emit('select','contact')"
          class="text-accent hover:underline underline-offset-4 cursor-pointer">contacter</button> !</span>
    </p>
  </div>
</template>
