"use client"

import { useState, useEffect } from "react"
import { getChecklists, deleteChecklist } from "@/api/checklistAPI"
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/solid"
import { useQuery, useMutation } from "@tanstack/react-query"
import Link from "next/link"
import NewChecklistButton from "@/app/components/NewChecklistButton"
import ChecklistDescription from "@/app/components/ChecklistDescription"

type ChecklistParams = {
  id: string
}

const ChecklistPage = ({ params }: { params: ChecklistParams }) => {
  const [checklists, setChecklists] = useState([])
  const [loading, setLoading] = useState(true)
  const { data, isPending, isError, error, isSuccess } = useQuery({
    queryKey: ["checklists"],
    queryFn: () => getChecklists(),
    staleTime: 0,
  })

  useEffect(() => {
    if (isSuccess && data) {
      setChecklists(data.checklists)
      setLoading(false)
    }
  }, [data, isSuccess])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <NewChecklistButton />
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

export default ChecklistPage
