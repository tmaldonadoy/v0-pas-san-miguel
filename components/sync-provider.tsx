"use client"

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'

// Tipos para el sistema de sincronización
interface NNAProfile {
  id: string
  alias: string
  level: number
  avatar: any
  settings: any
  permissions: {
    canUpgradeLevel: boolean
    canChangeSettings: boolean
    maxRegistriesPerDay: number
  }
  registriesCount?: number
  joinDate?: string
  lastUpdated: string
}

interface FacilitatorConfig {
  id: string
  name: string
  nnaProfiles: Record<string, NNAProfile>
  globalSettings: {
    defaultPermissions: {
      canUpgradeLevel: boolean
      canChangeSettings: boolean
      maxRegistriesPerDay: number
    }
    sessionDuration: number
    allowGroupChat: boolean
  }
  lastUpdated: string
}

interface SyncState {
  facilitatorConfig: FacilitatorConfig | null
  currentNNA: NNAProfile | null
  isOnline: boolean
  pendingChanges: any[]
  cache: Record<string, any>
}

// Acciones para el reducer
type SyncAction =
  | { type: 'SET_FACILITATOR_CONFIG'; payload: FacilitatorConfig }
  | { type: 'SET_CURRENT_NNA'; payload: NNAProfile }
  | { type: 'UPDATE_NNA_PROFILE'; payload: { id: string; updates: Partial<NNAProfile> } }
  | { type: 'UPDATE_NNA_LEVEL'; payload: { id: string; level: number } }
  | { type: 'UPDATE_NNA_PERMISSIONS'; payload: { id: string; permissions: Partial<NNAProfile['permissions']> } }
  | { type: 'ADD_PENDING_CHANGE'; payload: any }
  | { type: 'CLEAR_PENDING_CHANGES' }
  | { type: 'SET_ONLINE_STATUS'; payload: boolean }
  | { type: 'UPDATE_CACHE'; payload: { key: string; value: any } }
  | { type: 'SYNC_FROM_CACHE' }

const initialState: SyncState = {
  facilitatorConfig: null,
  currentNNA: null,
  isOnline: true,
  pendingChanges: [],
  cache: {}
}

// Reducer para manejar las acciones de sincronización
function syncReducer(state: SyncState, action: SyncAction): SyncState {
  switch (action.type) {
    case 'SET_FACILITATOR_CONFIG':
      return {
        ...state,
        facilitatorConfig: action.payload,
        cache: {
          ...state.cache,
          facilitatorConfig: action.payload
        }
      }

    case 'SET_CURRENT_NNA':
      return {
        ...state,
        currentNNA: action.payload,
        cache: {
          ...state.cache,
          currentNNA: action.payload
        }
      }

    case 'UPDATE_NNA_PROFILE':
      if (!state.facilitatorConfig) return state
      
      const updatedProfile = {
        ...state.facilitatorConfig.nnaProfiles[action.payload.id],
        ...action.payload.updates,
        lastUpdated: new Date().toISOString()
      }
      
      const newFacilitatorConfig = {
        ...state.facilitatorConfig,
        nnaProfiles: {
          ...state.facilitatorConfig.nnaProfiles,
          [action.payload.id]: updatedProfile
        },
        lastUpdated: new Date().toISOString()
      }
      
      return {
        ...state,
        facilitatorConfig: newFacilitatorConfig,
        currentNNA: state.currentNNA?.id === action.payload.id ? updatedProfile : state.currentNNA,
        cache: {
          ...state.cache,
          facilitatorConfig: newFacilitatorConfig,
          [`nna_${action.payload.id}`]: updatedProfile
        }
      }

    case 'UPDATE_NNA_LEVEL':
      if (!state.facilitatorConfig) return state
      
      return syncReducer(state, {
        type: 'UPDATE_NNA_PROFILE',
        payload: {
          id: action.payload.id,
          updates: { level: action.payload.level }
        }
      })

    case 'UPDATE_NNA_PERMISSIONS':
      if (!state.facilitatorConfig) return state
      
      return syncReducer(state, {
        type: 'UPDATE_NNA_PROFILE',
        payload: {
          id: action.payload.id,
          updates: { permissions: { ...state.facilitatorConfig.nnaProfiles[action.payload.id]?.permissions, ...action.payload.permissions } }
        }
      })

    case 'ADD_PENDING_CHANGE':
      return {
        ...state,
        pendingChanges: [...state.pendingChanges, { ...action.payload, timestamp: Date.now() }]
      }

    case 'CLEAR_PENDING_CHANGES':
      return {
        ...state,
        pendingChanges: []
      }

    case 'SET_ONLINE_STATUS':
      return {
        ...state,
        isOnline: action.payload
      }

    case 'UPDATE_CACHE':
      return {
        ...state,
        cache: {
          ...state.cache,
          [action.payload.key]: action.payload.value
        }
      }

    case 'SYNC_FROM_CACHE':
      return {
        ...state,
        facilitatorConfig: state.cache.facilitatorConfig || state.facilitatorConfig,
        currentNNA: state.cache.currentNNA || state.currentNNA
      }

    default:
      return state
  }
}

// Context
const SyncContext = createContext<{
  state: SyncState
  dispatch: React.Dispatch<SyncAction>
  actions: {
    initializeFacilitator: (config: FacilitatorConfig) => void
    setCurrentNNA: (nna: NNAProfile) => void
    updateNNALevel: (id: string, level: number) => void
    updateNNAPermissions: (id: string, permissions: Partial<NNAProfile['permissions']>) => void
    updateNNAProfile: (id: string, updates: Partial<NNAProfile>) => void
    syncPendingChanges: () => void
    canNNAUpgradeLevel: (nnaId: string) => boolean
    getNNAProfile: (id: string) => NNAProfile | null
  }
} | undefined>(undefined)

// Hook para usar el contexto
export function useSyncContext() {
  const context = useContext(SyncContext)
  if (!context) {
    throw new Error('useSyncContext must be used within a SyncProvider')
  }
  return context
}

// Provider component
export function SyncProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(syncReducer, initialState)

  // Monitoreo de conectividad
  useEffect(() => {
    const handleOnline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: true })
    const handleOffline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: false })

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Cargar cache al inicializar con persistencia real
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        // Cargar desde localStorage (persistente) y sessionStorage (temporal)
        const persistentData = localStorage.getItem('inner-world-persistent')
        const sessionData = sessionStorage.getItem('inner-world-session')
        
        if (persistentData) {
          const parsed = JSON.parse(persistentData)
          if (parsed.facilitatorConfig) {
            dispatch({ type: 'UPDATE_CACHE', payload: { key: 'facilitatorConfig', value: parsed.facilitatorConfig } })
          }
          if (parsed.currentNNA) {
            dispatch({ type: 'UPDATE_CACHE', payload: { key: 'currentNNA', value: parsed.currentNNA } })
          }
        }
        
        if (sessionData) {
          const parsed = JSON.parse(sessionData)
          if (parsed.pendingChanges) {
            parsed.pendingChanges.forEach((change: any) => {
              dispatch({ type: 'ADD_PENDING_CHANGE', payload: change })
            })
          }
        }
        
        dispatch({ type: 'SYNC_FROM_CACHE' })
      } catch (error) {
        console.error('Error loading from storage:', error)
      }
    }

    loadFromStorage()
  }, [])

  // Usar un callback estable para guardar en storage
  const saveToStorage = useCallback(() => {
    try {
      // Guardar datos persistentes (perfiles, configuración)
      const persistentData = {
        facilitatorConfig: state.facilitatorConfig,
        currentNNA: state.currentNNA,
        cache: state.cache,
        timestamp: Date.now()
      }
      localStorage.setItem('inner-world-persistent', JSON.stringify(persistentData))
      
      // Guardar datos de sesión (cambios pendientes)
      const sessionData = {
        pendingChanges: state.pendingChanges,
        isOnline: state.isOnline,
        timestamp: Date.now()
      }
      sessionStorage.setItem('inner-world-session', JSON.stringify(sessionData))
    } catch (error) {
      console.error('Error saving to storage:', error)
    }
  }, [state])
  
  // Ejecutar guardado cuando cambie el estado
  useEffect(() => {
    const timeoutId = setTimeout(saveToStorage, 100) // Debounce de 100ms
    return () => clearTimeout(timeoutId)
  }, [saveToStorage])

  // Sincronizar cambios pendientes cuando vuelva la conectividad
  useEffect(() => {
    if (state.isOnline && state.pendingChanges.length > 0) {
      // Simular sincronización con servidor
      console.log('Syncing pending changes:', state.pendingChanges)
      
      // En una implementación real, aquí enviarías los cambios al servidor
      setTimeout(() => {
        dispatch({ type: 'CLEAR_PENDING_CHANGES' })
      }, 1000)
    }
  }, [state.isOnline, state.pendingChanges])

  // Actions
  const actions = {
    initializeFacilitator: useCallback((config: FacilitatorConfig) => {
      dispatch({ type: 'SET_FACILITATOR_CONFIG', payload: config })
    }, []),

    setCurrentNNA: useCallback((nna: NNAProfile) => {
      dispatch({ type: 'SET_CURRENT_NNA', payload: nna })
    }, []),

    updateNNALevel: useCallback((id: string, level: number) => {
      // Solo el facilitador puede cambiar niveles
      dispatch({ type: 'UPDATE_NNA_LEVEL', payload: { id, level } })
      
      if (!state.isOnline) {
        dispatch({ type: 'ADD_PENDING_CHANGE', payload: { type: 'level_update', id, level } })
      }
    }, [state.isOnline]),

    updateNNAPermissions: useCallback((id: string, permissions: Partial<NNAProfile['permissions']>) => {
      dispatch({ type: 'UPDATE_NNA_PERMISSIONS', payload: { id, permissions } })
      
      if (!state.isOnline) {
        dispatch({ type: 'ADD_PENDING_CHANGE', payload: { type: 'permissions_update', id, permissions } })
      }
    }, [state.isOnline]),

    updateNNAProfile: useCallback((id: string, updates: Partial<NNAProfile>) => {
      dispatch({ type: 'UPDATE_NNA_PROFILE', payload: { id, updates } })
      
      if (!state.isOnline) {
        dispatch({ type: 'ADD_PENDING_CHANGE', payload: { type: 'profile_update', id, updates } })
      }
    }, [state.isOnline]),

    syncPendingChanges: useCallback(() => {
      if (state.pendingChanges.length > 0) {
        console.log('Manual sync triggered')
        dispatch({ type: 'CLEAR_PENDING_CHANGES' })
      }
    }, [state.pendingChanges]),

    canNNAUpgradeLevel: useCallback((nnaId: string) => {
      const profile = state.facilitatorConfig?.nnaProfiles[nnaId]
      return profile?.permissions.canUpgradeLevel || false
    }, [state.facilitatorConfig]),

    getNNAProfile: useCallback((id: string) => {
      return state.facilitatorConfig?.nnaProfiles[id] || null
    }, [state.facilitatorConfig])
  }

  return (
    <SyncContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </SyncContext.Provider>
  )
}

// Hook para facilitar el uso por componentes específicos
export function useNNAProfile(nnaId?: string) {
  const { state, actions } = useSyncContext()
  
  const profile = nnaId ? actions.getNNAProfile(nnaId) : state.currentNNA
  
  return {
    profile,
    updateLevel: (level: number) => nnaId && actions.updateNNALevel(nnaId, level),
    updatePermissions: (permissions: Partial<NNAProfile['permissions']>) => nnaId && actions.updateNNAPermissions(nnaId, permissions),
    updateProfile: (updates: Partial<NNAProfile>) => nnaId && actions.updateNNAProfile(nnaId, updates),
    canUpgradeLevel: nnaId ? actions.canNNAUpgradeLevel(nnaId) : false
  }
}

// Hook para facilitadores
export function useFacilitatorControls() {
  const { state, actions } = useSyncContext()
  
  return {
    facilitatorConfig: state.facilitatorConfig,
    nnaProfiles: state.facilitatorConfig?.nnaProfiles || {},
    updateNNALevel: actions.updateNNALevel,
    updateNNAPermissions: actions.updateNNAPermissions,
    updateNNAProfile: actions.updateNNAProfile,
    isOnline: state.isOnline,
    pendingChanges: state.pendingChanges.length,
    syncPendingChanges: actions.syncPendingChanges
  }
}