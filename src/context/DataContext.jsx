import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { createRepository } from '../data/repository'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const repository = useMemo(() => createRepository(), [])
  const [tasks, setTasks] = useState([])
  const [students, setStudents] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [dataError, setDataError] = useState('')
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(repository.backend === 'supabase')

  const refresh = useCallback(async () => {
    setLoading(true)
    setDataError('')
    try {
      const [nextTasks, nextStudents, nextApplications] = await Promise.all([
        repository.getTasks(),
        repository.getStudents(),
        repository.getApplications(),
      ])
      setTasks(nextTasks)
      setStudents(nextStudents)
      setApplications(nextApplications)
    } catch (error) {
      setDataError(error.message || '讀取資料失敗')
    } finally {
      setLoading(false)
    }
  }, [repository])

  useEffect(() => {
    let alive = true
    const boot = async () => {
      if (repository.getAuthSession) {
        try {
          const currentSession = await repository.getAuthSession()
          if (alive) setSession(currentSession)
        } catch (error) {
          if (alive) setDataError(error.message || '讀取登入狀態失敗')
        } finally {
          if (alive) setAuthLoading(false)
        }
      } else {
        setAuthLoading(false)
      }
      if (alive) await refresh()
    }

    boot()
    const unsubscribe = repository.onAuthStateChange?.((nextSession) => {
      setSession(nextSession)
      refresh()
    })

    return () => {
      alive = false
      unsubscribe?.()
    }
  }, [repository, refresh])

  const createAndRefresh = useCallback(async (method, data) => {
    const result = await repository[method](data)
    await refresh()
    return result
  }, [repository, refresh])

  const value = {
    backend: repository.backend,
    canReset: repository.canReset,
    loading,
    dataError,
    session,
    authLoading,
    tasks,
    students,
    applications,
    getTask: (id) => tasks.find((task) => task.id === id),
    refresh,
    createStudent: (data) => createAndRefresh('createStudent', data),
    deleteStudent: async (id) => {
      const result = await repository.deleteStudent(id)
      await refresh()
      return result
    },
    createTask: (data) => createAndRefresh('createTask', data),
    deleteTask: async (id) => {
      const result = await repository.deleteTask(id)
      await refresh()
      return result
    },
    createApplication: (data) => createAndRefresh('createApplication', data),
    updateTaskStatus: async (id, status) => {
      const result = await repository.updateTaskStatus(id, status)
      await refresh()
      return result
    },
    resetData: async () => {
      await repository.reset()
      await refresh()
    },
    signInAdmin: (credentials) => repository.signInAdmin?.(credentials),
    signOutAdmin: () => repository.signOutAdmin?.(),
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) throw new Error('useData must be used inside DataProvider')
  return context
}
