import type { ApiProject, ApiVitrine } from './content'
import type { ProjectPayload, VitrinePayload } from './payloads'

import type { SiteSettings } from '@/data/settings'
import type { Tag } from '@/data/tags'

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
  tags: Tag[]
}

export interface AuditEntry {
  id: number
  username: string
  action: string
  target: string | null
  ip: string | null
  createdAt: string
}

export interface BackupStatus {
  exists: boolean
  version: number
  generatedAt: string | null
  bytes: number
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

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as
    | { error?: { code?: string; message?: string; field?: string } }
    | null

  if (!response.ok) {
    const error = payload?.error
    throw new ApiError(
      error?.message ?? `Erreur HTTP ${response.status}`,
      response.status,
      error?.code,
      error?.field,
    )
  }

  return payload as T
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

  return parseResponse<T>(response)
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

  audit: () => request<{ entries: AuditEntry[] }>('/admin/audit'),

  backupStatus: () => request<BackupStatus>('/admin/backup'),

  refreshBackup: (csrf: string) =>
    request<BackupStatus>('/admin/backup', { method: 'POST', csrf }),

  upload: async (file: File, csrf: string) => {
    const body = new FormData()
    body.append('file', file)

    const response = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'X-CSRF-Token': csrf,
      },
      body,
      credentials: 'same-origin',
      cache: 'no-store',
    })

    return parseResponse<{ url: string; name: string; mime: string; size: number }>(response)
  },

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

  reorder: (collection: 'projects' | 'vitrines', ids: number[], csrf: string) =>
    request<{ ok: true; version: number }>('/admin/reorder', {
      method: 'POST',
      body: { collection, ids },
      csrf,
    }),

  createTag: (payload: { name: string; stack: string | null; visible: boolean }, csrf: string) =>
    request<Tag>('/admin/tags', { method: 'POST', body: payload, csrf }),

  updateTag: (id: number, payload: { name: string; stack: string | null; visible: boolean }, csrf: string) =>
    request<Tag>(`/admin/tags/${id}`, { method: 'PUT', body: payload, csrf }),

  deleteTag: (id: number, csrf: string) =>
    request<{ ok: true }>(`/admin/tags/${id}`, { method: 'DELETE', csrf }),

  deleteProject: (id: number, csrf: string) =>
    request<{ ok: true }>(`/admin/projects/${id}`, { method: 'DELETE', csrf }),

  createVitrine: (payload: VitrinePayload, csrf: string) =>
    request<ApiVitrine>('/admin/vitrines', { method: 'POST', body: payload, csrf }),

  updateVitrine: (id: number, payload: VitrinePayload, csrf: string) =>
    request<ApiVitrine>(`/admin/vitrines/${id}`, { method: 'PUT', body: payload, csrf }),

  deleteVitrine: (id: number, csrf: string) =>
    request<{ ok: true }>(`/admin/vitrines/${id}`, { method: 'DELETE', csrf }),
}
