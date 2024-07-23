"use client"

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid"
import Link from "next/link"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { deleteChecklist } from "@/utils/checklistAPI"

type ChecklistDescriptionProps = {
  key: any
  id: string
  title: string
  created_at: string
  updated_at: string
}

const ChecklistDescription = ({
  id,
  title,
  created_at,
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
      className="mt-1 flex items-center justify-between gap-x-6 rounded-sm bg-white p-3 hover:bg-slate-50"
    >
      <Link className="min-w-0" href={`/${id}`}>
        <div className="flex items-start gap-x-3">
          <p className="text-sm font-semibold leading-6 text-gray-900">
            {title}
          </p>
        </div>
        <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
          <p className="whitespace-nowrap">
            Created <time dateTime={created_at}>{parseDate(created_at)}</time>
          </p>
          <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
            <circle r={1} cx={1} cy={1} />
          </svg>
          <p className="whitespace-nowrap">
            Updated <time dateTime={updated_at}>{parseDate(updated_at)}</time>
          </p>
        </div>
      </Link>
      <div className="flex flex-none items-center gap-x-4">
        <Menu as="div" className="relative flex-none">
          <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
            <span className="sr-only">Open options</span>
            <EllipsisVerticalIcon aria-hidden="true" className="h-5 w-5" />
          </MenuButton>
          <MenuItems
            transition
            className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
          >
            <MenuItem>
              <a
                href={`/${id}`}
                className="block px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50"
              >
                View<span className="sr-only">, {project.name}</span>
              </a>
            </MenuItem>
            <MenuItem>
              <a
                href="#"
                className="block px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50"
              >
                Share<span className="sr-only">, {project.name}</span>
              </a>
            </MenuItem>
            <MenuItem>
              <span
                onClick={handleDelete}
                className="block cursor-pointer px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50"
              >
                Delete<span className="sr-only">, {project.name}</span>
              </span>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
    </li>
  )
}

export default ChecklistDescription
