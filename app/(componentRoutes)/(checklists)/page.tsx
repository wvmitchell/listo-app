"use client"

import { useState, useEffect } from "react"
import { getChecklists } from "@/utils/checklistAPI"
import { useQuery } from "@tanstack/react-query"
import ChecklistsOptionsMenu from "@/app/components/ChecklistsOptionsMenu"
import ChecklistDescription from "@/app/components/ChecklistDescription"
import { useAuth } from "@/app/context/AuthContext"
import type { Checklist } from "@/utils/types"

const ChecklistsPage = () => {
  const [checklists, setChecklists] = useState([])
  const [sharedChecklists, setSharedChecklists] = useState([])
  const { token } = useAuth()
  const { data, isPending, error, isSuccess } = useQuery({
    queryKey: ["checklists"],
    queryFn: () => getChecklists(token),
    staleTime: 0,
    refetchInterval: 1000 * 60 * 5, // 5 minutes
  })

  useEffect(() => {
    if (isSuccess && data) {
      const checklists = data.checklists.sort((a: Checklist, b: Checklist) => {
        return new Date(a.updated_at) < new Date(b.updated_at) ? 1 : -1
      })
      const shared_checklists = data.shared_checklists.sort(
        (a: Checklist, b: Checklist) => {
          return new Date(a.updated_at) < new Date(b.updated_at) ? 1 : -1
        },
      )

      setChecklists(checklists)
      setSharedChecklists(shared_checklists)
    }
  }, [data, isSuccess])

  if (isPending) return <div>Loading...</div>
  if (error) throw error

  return (
    <div>
      <div className="flex flex-row items-end justify-between">
        <h2 className="text-lg font-semibold">My Stuff</h2>
        <ChecklistsOptionsMenu />
      </div>
      <ul role="list">
        {checklists.map((checklist: { [key: string]: any }) => (
          <ChecklistDescription
            key={checklist.id}
            id={checklist.id}
            title={checklist.title}
            locked={checklist.locked}
            collaborators={checklist.collaborators}
            shared={false}
            updated_at={checklist.updated_at}
          />
        ))}
      </ul>
      <div
        className={`mt-4 flex flex-row items-end justify-between ${sharedChecklists.length ? "" : "hidden"}`}
      >
        <h2 className="text-lg font-semibold">Shared With Me</h2>
      </div>
      <ul role="list">
        {sharedChecklists.map((checklist: { [key: string]: any }) => (
          <ChecklistDescription
            key={checklist.id}
            id={checklist.id}
            title={checklist.title}
            locked={checklist.locked}
            collaborators={checklist.collaborators}
            shared={true}
            updated_at={checklist.updated_at}
          />
        ))}
      </ul>
    </div>
  )
}

export default ChecklistsPage
