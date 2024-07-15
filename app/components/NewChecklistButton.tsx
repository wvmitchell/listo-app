"use client"

import { PencilSquareIcon } from "@heroicons/react/24/solid"
import { useRouter } from "next/navigation"
import { createChecklist } from "@/api/checklistAPI"

const NewChecklistButton = () => {
  const router = useRouter()

  async function handleNewChecklist() {
    let { checklist } = await createChecklist()
    router.push(`/${checklist.id}`)
  }

  return (
    <div className="flex justify-end border-b-[1px] border-slate-500">
      <button onClick={handleNewChecklist}>
        <PencilSquareIcon className="mx-5 mb-2 h-5 w-5 text-slate-500 active:text-slate-700" />
      </button>
    </div>
  )
}

export default NewChecklistButton
