<script setup lang="ts">
withDefaults(defineProps<{ headingLevel?: 'h1' | 'h2' }>(), { headingLevel: 'h1' })
</script>

<template>
  <div>
    <component :is="headingLevel" class="font-heading text-[clamp(2.2rem,10vw,4.5rem)] font-bold mb-4 leading-[1.1] tracking-tight">
      Mon Stack.
    </component>
    <div class="grid grid-cols-2 md:grid-cols-5 gap-8 text-sm">
      <div>
        <h3 class="font-bold text-accent mb-2 uppercase tracking-wider">Front-end</h3>
        <ul class="space-y-1 text-muted">
          <li>>HTML/CSS</li>
          <li>>JavaScript</li>
          <li>>Tailwind</li>
        </ul>
      </div>
      <div>
        <h3 class="font-bold text-accent mb-2 uppercase tracking-wider">Back-end</h3>
        <ul class="space-y-1 text-muted">
          <li>>Java</li>
          <li>>Python (Django, FastAPI)</li>
          <li>>Node.js</li>
        </ul>
      </div>
      <div>
        <h3 class="font-bold text-accent mb-2 uppercase tracking-wider">Bases de données</h3>
        <ul class="space-y-1 text-muted">
          <li>>PostgreSQL</li>
          <li>>Redis</li>
          <li>>Firebase</li>
        </ul>
      </div>
      <div>
        <h3 class="font-bold text-accent mb-2 uppercase tracking-wider">Mobile</h3>
        <ul class="space-y-1 text-muted">
          <li>>Flutter / Dart</li>
        </ul>
      </div>
      <div>
        <h3 class="font-bold text-accent mb-2 uppercase tracking-wider">Autres</h3>
        <ul class="space-y-1 text-muted">
          <li>>Git</li>
          <li>>OAuth</li>
        </ul>
      </div>
    </div>
  </div>
</template>
