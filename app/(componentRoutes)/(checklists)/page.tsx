"use client"

import { useState, useEffect } from "react"
import {
  getChecklists,
  getSharedChecklists,
  addUserToSharedList,
} from "@/utils/checklistAPI"
import { useQuery } from "@tanstack/react-query"
import ChecklistsOptionsMenu from "@/app/components/ChecklistsOptionsMenu"
import ChecklistDescription from "@/app/components/ChecklistDescription"
import type { Checklist } from "@/utils/types"

const ChecklistsPage = () => {
  const [checklists, setChecklists] = useState([])
  const [shraredChecklists, setSharedChecklists] = useState([])
  const { data, isPending, error, isSuccess } = useQuery({
    queryKey: ["checklists"],
    queryFn: () => getChecklists(),
    staleTime: 0,
  })

  const {
    data: sharedData,
    isPending: sharedDataIsPending,
    error: sharedDataError,
    isSuccess: sharedDataIsSuccess,
  } = useQuery({
    queryKey: ["sharedChecklists"],
    queryFn: async () => {
      const shortCode = sessionStorage.getItem("shortCode")
      if (shortCode) {
        await addUserToSharedList(shortCode)
        sessionStorage.removeItem("shortCode")
      }

      return await getSharedChecklists()
    },
    staleTime: 0,
  })

  useEffect(() => {
    if (isSuccess && data) {
      const checklists = data.checklists.sort((a: Checklist, b: Checklist) => {
        return new Date(a.updated_at) < new Date(b.updated_at) ? 1 : -1
      })
      setChecklists(checklists)
    }
  }, [data, isSuccess])

  useEffect(() => {
    if (sharedDataIsSuccess && sharedData) {
      setSharedChecklists(sharedData.checklists)
    }
  }, [sharedData, sharedDataIsSuccess])

  if (isPending || sharedDataIsPending) return <div>Loading...</div>
  if (error) throw error
  if (sharedDataError) throw sharedDataError

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
            shared={false}
            updated_at={checklist.updated_at}
          />
        ))}
      </ul>
      <div
        className={`mt-4 flex flex-row items-end justify-between ${shraredChecklists.length ? "" : "hidden"}`}
      >
        <h2 className="text-lg font-semibold">Shared With Me</h2>
      </div>
      <ul role="list">
        {shraredChecklists.map((checklist: { [key: string]: any }) => (
          <ChecklistDescription
            key={checklist.id}
            id={checklist.id}
            title={checklist.title}
            locked={checklist.locked}
            shared={true}
            updated_at={checklist.updated_at}
          />
        ))}
      </ul>
    </div>
  )
}

export default ChecklistsPage
