"use client"

import { TrashIcon } from "@heroicons/react/24/solid"
import Link from "next/link"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { deleteChecklist } from "@/api/checklistAPI"

type ChecklistDescriptionProps = {
  key: any
  id: string
  title: string
  created_at: string
}

const ChecklistDescription = ({
  id,
  title,
  created_at,
}: ChecklistDescriptionProps) => {
  const queryClient = useQueryClient()
  const deleteChecklistMutation = useMutation({
    mutationFn: (variables: { id: string }) => {
      return deleteChecklist(variables.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklists"] })
    },
  })

  function handleDelete() {
    deleteChecklistMutation.mutate({ id })
  }

  return (
    <div className="grid grid-cols-[3fr_1fr] rounded-md bg-white p-5" key={id}>
      <Link href={`/${id}`}>
        <h2 className="font-semibold">{title}</h2>
        <p className="text-sm text-slate-500">{created_at}</p>
      </Link>
      <div className="grid justify-items-end">
        <button id={id} onClick={handleDelete}>
          <TrashIcon className="h-5 w-5 cursor-pointer text-slate-500 hover:text-slate-700" />
        </button>
      </div>
    </div>
  )
}

export default ChecklistDescription
