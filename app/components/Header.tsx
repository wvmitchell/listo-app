import Link from "next/link"
import Image from "next/image"
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import {
  ArrowRightStartOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline"
import type { User } from "@/utils/types"
import fullLogo from "@/app/images/full_logo.png"

type HeaderProps = {
  user?: User | null
  isLoading?: boolean
  handleLogout: () => void
}

function Header({ user, isLoading, handleLogout }: HeaderProps) {
  return (
    <div
      className={`my-4 flex flex-row justify-between ${isLoading || !user ? "hidden" : ""}`}
    >
      <Link href="/">
        <Image src={fullLogo} width={50} height={50} alt="Listo" />
      </Link>
      <div>
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <MenuButton className="flex items-center rounded-full bg-gray-100">
              {user?.picture ? (
                <Image
                  src={user.picture}
                  width={40}
                  height={40}
                  alt="Profile"
                  className="rounded-full"
                />
              ) : (
                <UserCircleIcon
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
            </MenuButton>
          </div>
          <MenuItems
            transition
            className="absolute right-0 z-10 mt-2 w-auto min-w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
          >
            <div className="py-1">
              <MenuItem>
                <div>
                  <p className="block cursor-default px-4 py-2 text-sm font-semibold text-gray-700">
                    Hi {user?.email}!
                  </p>
                </div>
              </MenuItem>
              <MenuItem>
                <button
                  onClick={handleLogout}
                  className="group flex items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                >
                  <ArrowRightStartOnRectangleIcon
                    aria-hidden="true"
                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                  />
                  Logout
                </button>
              </MenuItem>
            </div>
          </MenuItems>
        </Menu>
      </div>
    </div>
  )
}

export default Header
