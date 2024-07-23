"use client"

import { useState, useEffect } from "react"
import { getChecklists } from "@/utils/checklistAPI"
import { useQuery } from "@tanstack/react-query"
import ChecklistsOptionsMenu from "@/app/components/ChecklistsOptionsMenu"
import ChecklistDescription from "@/app/components/ChecklistDescription"

const ChecklistsPage = () => {
  const [checklists, setChecklists] = useState([])
  const { data, isPending, error, isSuccess } = useQuery({
    queryKey: ["checklists"],
    queryFn: () => getChecklists(),
    staleTime: 0,
  })

  useEffect(() => {
    if (isSuccess && data) {
      setChecklists(data.checklists)
    }
  }, [data, isSuccess])

  if (isPending) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <div className="flex flex-row justify-end">
        <ChecklistsOptionsMenu />
      </div>
      <ul role="list">
        {checklists.map((checklist: { [key: string]: any }) => (
          <ChecklistDescription
            key={checklist.id}
            id={checklist.id}
            title={checklist.title}
            created_at={checklist.created_at}
            updated_at={checklist.updated_at}
          />
        ))}
      </ul>
    </div>
  )
}

export default ChecklistsPage
