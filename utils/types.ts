export type ChecklistItem = {
  id: string
  content: string
  checked: boolean
  ordering: number
  created_at: string
  updated_at: string
}

export type Checklist = {
  id: string
  title: string
  locked: boolean
  updated_at: string
}
