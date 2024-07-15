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
      <div className="grid grid-cols-1 gap-3">
        {checklists.map((checklist: { [key: string]: any }) => (
          <ChecklistDescription
            key={checklist.id}
            id={checklist.id}
            title={checklist.title}
            created_at={checklist.created_at}
          />
        ))}
      </div>
      <NewChecklistButton />
    </div>
  )
}

export default ChecklistPage
