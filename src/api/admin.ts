import type { ApiProject, ApiVitrine } from './content'

import type { SiteSettings } from '@/data/settings'

export interface MeResponse {
  authenticated: boolean
  username?: string
  csrf?: string
}

export interface AuthResponse {
  authenticated: true
  username: string
  csrf: string
}

export interface AdminContent {
  version: number
  updatedAt: string
  settings: SiteSettings
  projects: ApiProject[]
  vitrines: ApiVitrine[]
}

export interface ProjectPayload {
  title: string
  context: string
  shortDescription: string
  description: string
  tags: string[]
  displayMode: 'card' | 'detailed'
  detailImage: string | null
  stack: string[]
  detailedStack: string[]
  reasons: string[]
  link: string | null
  linkText: string
  image: string | null
  sortOrder: number
  published: boolean
  featured: boolean
  showOnProjects: boolean
}

export interface VitrinePayload {
  title: string
  description: string
  image: string | null
  link: string | null
  linkText: string
  sortOrder: number
  published: boolean
  featured: boolean
  showOnProjects: boolean
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code = 'error',
    public readonly field?: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(
  path: string,
  options: {
    method?: string
    body?: unknown
    csrf?: string
  } = {},
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }
  if (options.csrf) {
    headers['X-CSRF-Token'] = options.csrf
  }

  const response = await fetch(`/api${path}`, {
    method: options.method ?? 'GET',
    headers,
    credentials: 'same-origin',
    cache: 'no-store',
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })

  const payload = (await response.json().catch(() => null)) as
    | { error?: { code?: string; message?: string; field?: string } }
    | null

  if (!response.ok) {
    throw new ApiError(
      payload?.error?.message ?? `Erreur HTTP ${response.status}`,
      response.status,
      payload?.error?.code,
      payload?.error?.field,
    )
  }

  return payload as T
}

export const adminApi = {
  me: () => request<MeResponse>('/auth/me'),

  login: (username: string, password: string) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: { username, password },
    }),

  logout: (csrf: string) =>
    request<{ ok: true }>('/auth/logout', {
      method: 'POST',
      csrf,
    }),

  content: () => request<AdminContent>('/admin/content'),

  updateSettings: (payload: Partial<SiteSettings>, csrf: string) =>
    request<{ ok: true; settings: SiteSettings; version: number }>('/admin/settings', {
      method: 'PUT',
      body: payload,
      csrf,
    }),

  createProject: (payload: ProjectPayload, csrf: string) =>
    request<ApiProject>('/admin/projects', { method: 'POST', body: payload, csrf }),

  updateProject: (id: number, payload: ProjectPayload, csrf: string) =>
    request<ApiProject>(`/admin/projects/${id}`, { method: 'PUT', body: payload, csrf }),

  deleteProject: (id: number, csrf: string) =>
    request<{ ok: true }>(`/admin/projects/${id}`, { method: 'DELETE', csrf }),

  createVitrine: (payload: VitrinePayload, csrf: string) =>
    request<ApiVitrine>('/admin/vitrines', { method: 'POST', body: payload, csrf }),

  updateVitrine: (id: number, payload: VitrinePayload, csrf: string) =>
    request<ApiVitrine>(`/admin/vitrines/${id}`, { method: 'PUT', body: payload, csrf }),

  deleteVitrine: (id: number, csrf: string) =>
    request<{ ok: true }>(`/admin/vitrines/${id}`, { method: 'DELETE', csrf }),
}
