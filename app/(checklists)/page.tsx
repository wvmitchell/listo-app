import { getChecklists, deleteChecklist } from "@/api/checklistAPI"
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/solid"
import Link from "next/link"
import NewChecklistButton from "@/app/components/NewChecklistButton"

type ChecklistParams = {
  id: string
}

const ChecklistPage = async ({ params }: { params: ChecklistParams }) => {
  let { checklists } = await getChecklists()
  return (
    <div>
      <div className="grid grid-cols-1 gap-3">
        {checklists.map((checklist: { [key: string]: any }) => (
          <div
            className="grid grid-cols-[3fr_1fr] rounded-md bg-white p-5"
            key={checklist.id}
          >
            <Link href={`/${checklist.id}`}>
              <h2 className="font-semibold">{checklist.title}</h2>
              <p className="text-sm text-slate-500">{checklist.created_at}</p>
            </Link>
            <div className="grid justify-items-end">
              <button id={checklist.id}>
                <TrashIcon className="h-5 w-5 cursor-pointer text-slate-500 hover:text-slate-700" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <NewChecklistButton />
    </div>
  )
}

export default ChecklistPage
