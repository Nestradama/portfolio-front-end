<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps<{ text: string }>()

type Part = { text: string; href?: string; internal?: boolean }

function resolve(url: string): { href: string; internal: boolean } | null {
  // Same-origin absolute links are converted to RouterLinks to avoid full reloads.
  if (url.startsWith('#') || url.startsWith('/')) {
    return { href: url, internal: true }
  }
  if (/^https?:\/\//i.test(url)) {
    try {
      const parsed = new URL(url)
      if (parsed.origin === window.location.origin) {
        return { href: `${parsed.pathname}${parsed.search}${parsed.hash}`, internal: true }
      }
      return { href: url, internal: false }
    } catch {
      return { href: url, internal: false }
    }
  }
  if (/^mailto:/i.test(url)) {
    return { href: url, internal: false }
  }
  return null
}

const parts = computed<Part[]>(() => {
  const result: Part[] = []
  const pattern = /\[([^\]]+)\]\(([^)\s]+)\)/g
  let cursor = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(props.text)) !== null) {
    if (match.index > cursor) {
      result.push({ text: props.text.slice(cursor, match.index) })
    }

    const label = match[1] ?? ''
    const rawHref = match[2] ?? ''
    const resolved = resolve(rawHref)
    result.push(
      resolved ? { text: label, href: resolved.href, internal: resolved.internal } : { text: `[${label}](${rawHref})` },
    )
    cursor = match.index + match[0].length
  }

  if (cursor < props.text.length) {
    result.push({ text: props.text.slice(cursor) })
  }

  return result
})
</script>

<template>
  <template v-for="(part, index) in parts" :key="index">
    <RouterLink
      v-if="part.href && part.internal"
      :to="part.href"
      class="text-accent underline-offset-4 hover:underline"
    >{{ part.text }}</RouterLink>
    <a
      v-else-if="part.href"
      :href="part.href"
      rel="noreferrer"
      class="text-accent underline-offset-4 hover:underline"
    >{{ part.text }}</a>
    <template v-else>{{ part.text }}</template>
  </template>
</template>
