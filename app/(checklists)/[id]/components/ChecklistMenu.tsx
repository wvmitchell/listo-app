"use client"

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import {
  ChevronDownIcon,
  CheckCircleIcon,
  MinusCircleIcon,
  LockClosedIcon,
  LockOpenIcon,
  TrashIcon,
  UserPlusIcon,
} from "@heroicons/react/20/solid"

type ChecklistMenuProps = {
  locked: boolean
  handleLockChecklist: (locked: boolean) => void
  handleToggleAll: (toggle: boolean) => void
  handleDeleteCompleted: () => void
}

function ChecklistMenu({
  locked,
  handleLockChecklist,
  handleToggleAll,
  handleDeleteCompleted,
}: ChecklistMenuProps) {
  const menuItems: { [key: string]: { icon: any; action: () => void } } = {
    "Check All": {
      icon: CheckCircleIcon,
      action: () => handleToggleAll(true),
    },
    "Uncheck All": {
      icon: MinusCircleIcon,
      action: () => handleToggleAll(false),
    },
    Share: {
      icon: UserPlusIcon,
      action: () => console.log("Share"),
    },
  }

  if (locked) {
    menuItems["Unlock"] = {
      icon: LockOpenIcon,
      action: () => handleLockChecklist(false),
    }
  } else {
    menuItems["Lock"] = {
      icon: LockClosedIcon,
      action: () => handleLockChecklist(true),
    }

    menuItems["Delete Completed"] = {
      icon: TrashIcon,
      action: () => handleDeleteCompleted(),
    }
  }

  const menuItemComponents = Object.entries(menuItems).map(
    ([label, { icon: Icon, action }]) => (
      <MenuItemButton key={label} label={label} Icon={Icon} action={action} />
    ),
  )

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">
          Options
          <ChevronDownIcon
            aria-hidden="true"
            className="-mr-1 h-5 w-5 text-slate-400"
          />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-slate-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        {menuItemComponents}
      </MenuItems>
    </Menu>
  )
}

function MenuItemButton({
  label,
  Icon,
  action,
}: {
  label: string
  Icon: any
  action: () => void
}) {
  return (
    <MenuItem>
      <button
        onClick={action}
        className="group flex w-full items-center px-4 py-2 text-sm text-slate-700 data-[focus]:bg-slate-100 data-[focus]:text-slate-900"
      >
        <Icon
          aria-hidden="true"
          className="mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-500"
        />
        {label}
      </button>
    </MenuItem>
  )
}

export default ChecklistMenu
