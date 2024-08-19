import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import Image from "next/image"
import type { Collaborator } from "@/utils/types"

type CollaboratorsMenuProps = {
  checklistID: string
  collaborators: Collaborator[]
  userEmailAddress: string
}

const CollaboratorsMenu = ({
  checklistID,
  collaborators,
  userEmailAddress,
}: CollaboratorsMenuProps) => {
  let filteredCollaborators = collaborators.filter(
    (collaborator) => collaborator.email !== userEmailAddress,
  )

  const menu = (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          Collaborators
        </MenuButton>
      </div>
      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        {filteredCollaborators.map((collaborator, i) => (
          <MenuItem key={`${checklistID}-collaborator-${i}`}>
            <div className="group flex w-full cursor-default items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900">
              <Image
                src={collaborator.picture}
                alt={collaborator.email}
                width={40}
                height={40}
                className="mr-3 h-5 w-5 rounded-full"
              />
              {collaborator.email}
            </div>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  )

  const noCollaborators = null

  return filteredCollaborators.length > 0 ? menu : noCollaborators
}

export default CollaboratorsMenu
