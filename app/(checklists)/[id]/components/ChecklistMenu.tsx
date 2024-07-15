"use client"

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import {
  ChevronDownIcon,
  CheckCircleIcon,
  MinusCircleIcon,
  DocumentDuplicateIcon,
  LockClosedIcon,
  LockOpenIcon,
  TrashIcon,
  UserPlusIcon,
} from "@heroicons/react/20/solid"

type ChecklistMenuProps = {
  locked: boolean
  handleLockChecklist: (locked: boolean) => void
  handleToggleAll: (toggle: boolean) => void
}

function ChecklistMenu({
  locked,
  handleLockChecklist,
  handleToggleAll,
}: ChecklistMenuProps) {
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
          <span
            onClick={() => handleLockChecklist(!locked)}
            className="group flex items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
          >
            {locked ? (
              <LockClosedIcon
                aria-hidden="true"
                className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
              />
            ) : (
              <LockOpenIcon
                aria-hidden="true"
                className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
              />
            )}
            {locked ? "Unlock" : "Lock"}
          </span>
        </MenuItem>
        <MenuItem>
          <span
            onClick={() => handleToggleAll(true)}
            className="group flex items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
          >
            <CheckCircleIcon
              aria-hidden="true"
              className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
            />
            Check All
          </span>
        </MenuItem>
        <MenuItem>
          <span
            onClick={() => handleToggleAll(false)}
            className="group flex items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
          >
            <MinusCircleIcon
              aria-hidden="true"
              className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
            />
            Uncheck All
          </span>
        </MenuItem>
        <MenuItem>
          <a
            href="#"
            className="group flex items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
          >
            <DocumentDuplicateIcon
              aria-hidden="true"
              className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
            />
            Duplicate
          </a>
        </MenuItem>
        <MenuItem>
          <a
            href="#"
            className="group flex items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
          >
            <UserPlusIcon
              aria-hidden="true"
              className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
            />
            Share
          </a>
        </MenuItem>
        <MenuItem>
          <a
            href="#"
            className="group flex items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
          >
            <TrashIcon
              aria-hidden="true"
              className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
            />
            Delete
          </a>
        </MenuItem>
      </MenuItems>
    </Menu>
  )
}

export default ChecklistMenu
