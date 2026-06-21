import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { createRepository } from '../data/repository'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const repository = useMemo(() => createRepository(), [])
  const [, setRevision] = useState(0)
  const refresh = useCallback(() => setRevision((value) => value + 1), [])

  const value = {
    tasks: repository.getTasks(),
    students: repository.getStudents(),
    applications: repository.getApplications(),
    getTask: (id) => repository.getTask(id),
    createStudent: (data) => { const result = repository.createStudent(data); refresh(); return result },
    createTask: (data) => { const result = repository.createTask(data); refresh(); return result },
    createApplication: (data) => { const result = repository.createApplication(data); refresh(); return result },
    updateTaskStatus: (id, status) => { const result = repository.updateTaskStatus(id, status); refresh(); return result },
    resetData: () => { repository.reset(); refresh() },
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) throw new Error('useData must be used inside DataProvider')
  return context
}
