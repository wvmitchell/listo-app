"use client"

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { ChevronDownIcon, PencilSquareIcon } from "@heroicons/react/24/solid"
import { useRouter } from "next/navigation"
import { createChecklist } from "@/utils/checklistAPI"
import { useAuth } from "@/app/context/AuthContext"

const ChecklistsOptionsMenu = () => {
  const router = useRouter()
  const { token } = useAuth()

  async function handleNewChecklist() {
    if (!token) return
    let checklist = await createChecklist(token)
    router.push(`/${checklist.id}`)
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          Options
          <ChevronDownIcon
            aria-hidden="true"
            className="-mr-1 h-5 w-5 text-gray-400"
          />
        </MenuButton>
      </div>
      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <MenuItem>
          <button
            onClick={handleNewChecklist}
            className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
          >
            <PencilSquareIcon
              aria-hidden="true"
              className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
            />
            New Listo
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  )
}

export default ChecklistsOptionsMenu
