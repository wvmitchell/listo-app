"use client"

import { useState } from "react"
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { EllipsisVerticalIcon, LockClosedIcon } from "@heroicons/react/24/solid"
import Link from "next/link"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { deleteChecklist, leaveSharedChecklist } from "@/utils/checklistAPI"
import ConfirmDeleteDialog from "./ConfirmDeleteDialog"
import ShareDialog from "./ShareDialog"
import LeaveDialog from "./LeaveDialog"
import CollaboratorsMenu from "./CollaboratorsMenu"
import { useAuth } from "@/app/context/AuthContext"
import type { Checklist, Collaborator } from "@/utils/types"

type ChecklistDescriptionProps = {
  key: any
  id: string
  title: string
  locked: boolean
  collaborators: Collaborator[]
  updated_at: string
  shared: boolean
}

const ChecklistDescription = ({
  id,
  title,
  locked,
  updated_at,
  shared,
  collaborators,
}: ChecklistDescriptionProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false)
  const { user, token } = useAuth()
  const queryClient = useQueryClient()
  const deleteChecklistMutation = useMutation({
    mutationFn: (variables: { id: string }) => {
      return deleteChecklist(variables.id, token)
    },
    onMutate: (variables: { id: string }) => {
      const previousData = queryClient.getQueryData(["checklists"])

      queryClient.setQueryData(
        ["checklists"],
        (oldData: {
          checklists: Checklist[]
          shared_checklists: Checklist[]
        }) => {
          const nextChecklists = oldData?.checklists.filter(
            (checklist) => checklist.id !== variables.id,
          )
          const nextSharedChecklists = oldData?.shared_checklists
          return {
            checklists: nextChecklists,
            shared_checklists: nextSharedChecklists,
          }
        },
      )

      return { previousData }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklists"] })
    },
  })

  const leaveSharedListMutation = useMutation({
    mutationFn: (variables: { id: string }) => {
      return leaveSharedChecklist(variables.id, token)
    },
    onMutate: (variables: { id: string }) => {
      const previousData = queryClient.getQueryData(["checklists"])

      queryClient.setQueryData(
        ["checklists"],
        (oldData: {
          checklists: Checklist[]
          shared_checklists: Checklist[]
        }) => {
          const nextChecklists = oldData?.checklists
          const nextSharedChecklists = oldData?.shared_checklists.filter(
            (checklist) => checklist.id !== variables.id,
          )
          return {
            checklists: nextChecklists,
            shared_checklists: nextSharedChecklists,
          }
        },
      )

      return { previousData }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklists"] })
    },
  })

  function handleDelete() {
    if (locked || shared) return
    setShowDeleteConfirm(false)
    deleteChecklistMutation.mutate({ id })
  }

  function handleLeave() {
    if (!shared) return
    setShowLeaveConfirm(false)
    leaveSharedListMutation.mutate({ id })
  }

  function parseDate(date: string) {
    const dateObj = new Date(Date.parse(date))
    return dateObj.toLocaleDateString("en-US")
  }

  return (
    <li
      key={id}
      className="mt-1 flex items-center justify-between rounded-sm bg-white p-3 hover:bg-gray-50"
    >
      <Link className="w-full" href={`/${id}`}>
        <div className="flex items-center gap-x-3">
          <p className="text-state-900 text-base font-semibold leading-6">
            {title}
          </p>
          {locked && (
            <span className="mb-1 ml-1">
              <LockClosedIcon className="h-4 w-4 text-gray-500" />
            </span>
          )}
        </div>
        <div className="text-state-500 mt-1 flex items-center gap-x-2 text-sm leading-5">
          <p className="whitespace-nowrap">
            Updated <time dateTime={updated_at}>{parseDate(updated_at)}</time>
          </p>
        </div>
      </Link>
      {user?.email && (
        <div className="pr-4">
          <CollaboratorsMenu
            checklistID={id}
            collaborators={collaborators}
            userEmailAddress={user.email}
          />
        </div>
      )}
      <div className="flex flex-none items-center gap-x-4">
        <Menu as="div" className="relative flex-none">
          <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
            <span className="sr-only">Open options</span>
            <EllipsisVerticalIcon aria-hidden="true" className="h-5 w-5" />
          </MenuButton>
          <MenuItems
            transition
            className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
          >
            <MenuItem>
              <a
                href={`/${id}`}
                className="block px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50"
              >
                View<span className="sr-only">, {title}</span>
              </a>
            </MenuItem>
            {!shared && (
              <MenuItem>
                <button
                  onClick={() => setShowShareDialog(true)}
                  className="block w-full px-3 py-1 text-left text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50"
                >
                  Share<span className="sr-only">, {title}</span>
                </button>
              </MenuItem>
            )}
            {!locked && !shared && (
              <MenuItem>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="block w-full cursor-pointer px-3 py-1 text-left text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50"
                >
                  Delete<span className="sr-only">, {title}</span>
                </button>
              </MenuItem>
            )}
            {shared && (
              <MenuItem>
                <button
                  onClick={() => setShowLeaveConfirm(true)}
                  className="block w-full cursor-pointer px-3 py-1 text-left text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50"
                >
                  Leave<span className="sr-only">, {title}</span>
                </button>
              </MenuItem>
            )}
          </MenuItems>
        </Menu>
      </div>
      <ConfirmDeleteDialog
        title={title}
        isOpen={showDeleteConfirm}
        setShowDeleteConfirm={setShowDeleteConfirm}
        handleDelete={handleDelete}
      />
      <ShareDialog
        title={title}
        showShareDialog={showShareDialog}
        setShowShareDialog={setShowShareDialog}
        checklistID={id}
      />
      <LeaveDialog
        title={title}
        showLeaveConfirm={showLeaveConfirm}
        setShowLeaveConfirm={setShowLeaveConfirm}
        handleLeave={handleLeave}
      />
    </li>
  )
}

export default ChecklistDescription
