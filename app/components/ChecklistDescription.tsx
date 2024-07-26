"use client"

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { EllipsisVerticalIcon, LockClosedIcon } from "@heroicons/react/24/solid"
import Link from "next/link"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { deleteChecklist } from "@/utils/checklistAPI"

type ChecklistDescriptionProps = {
  key: any
  id: string
  title: string
  locked: boolean
  updated_at: string
}

const ChecklistDescription = ({
  id,
  title,
  locked,
  updated_at,
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
    if (locked) return
    deleteChecklistMutation.mutate({ id })
  }

  const project = {
    id: "1",
    name: "Project Apollo",
    href: "#",
    status: "Active",
    dueDate: "Mar 20, 2020",
    dueDateTime: "2020-03-20",
    createdBy: "Dries Vincent",
  }

  function parseDate(date: string) {
    const dateObj = new Date(Date.parse(date))
    return dateObj.toLocaleDateString("en-US")
  }

  return (
    <li
      key={id}
      className="mt-1 flex items-center justify-between rounded-sm bg-white p-3 hover:bg-slate-50"
    >
      <Link className="w-full" href={`/${id}`}>
        <div className="flex items-center gap-x-3">
          <p className="text-state-900 text-base font-semibold leading-6">
            {title}
          </p>
          {locked && (
            <span className="mb-1 ml-1">
              <LockClosedIcon className="h-4 w-4 text-slate-500" />
            </span>
          )}
        </div>
        <div className="text-state-500 mt-1 flex items-center gap-x-2 text-sm leading-5">
          <p className="whitespace-nowrap">
            Updated <time dateTime={updated_at}>{parseDate(updated_at)}</time>
          </p>
        </div>
      </Link>
      <div className="flex flex-none items-center gap-x-4">
        <Menu as="div" className="relative flex-none">
          <MenuButton className="-m-2.5 block p-2.5 text-slate-500 hover:text-slate-900">
            <span className="sr-only">Open options</span>
            <EllipsisVerticalIcon aria-hidden="true" className="h-5 w-5" />
          </MenuButton>
          <MenuItems
            transition
            className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-slate-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
          >
            <MenuItem>
              <a
                href={`/${id}`}
                className="block px-3 py-1 text-sm leading-6 text-slate-900 data-[focus]:bg-slate-50"
              >
                View<span className="sr-only">, {project.name}</span>
              </a>
            </MenuItem>
            <MenuItem>
              <a
                href="#"
                className="block px-3 py-1 text-sm leading-6 text-slate-900 data-[focus]:bg-slate-50"
              >
                Share<span className="sr-only">, {project.name}</span>
              </a>
            </MenuItem>
            {!locked && (
              <MenuItem>
                <span
                  onClick={handleDelete}
                  className="block cursor-pointer px-3 py-1 text-sm leading-6 text-slate-900 data-[focus]:bg-slate-50"
                >
                  Delete<span className="sr-only">, {project.name}</span>
                </span>
              </MenuItem>
            )}
          </MenuItems>
        </Menu>
      </div>
    </li>
  )
}

export default ChecklistDescription
