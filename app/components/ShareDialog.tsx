"use client"

import { useState } from "react"
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react"
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline"
import { Honeybadger } from "@honeybadger-io/react"
import { getChecklistShareCode } from "@/utils/checklistAPI"

type ShareDialogProps = {
  title: string
  showShareDialog: boolean
  setShowShareDialog: (value: boolean) => void
  checklistID: string
}

const ShareDialog = ({
  title,
  showShareDialog,
  setShowShareDialog,
  checklistID,
}: ShareDialogProps) => {
  const defaultText = "Click to copy sharable link"
  const [shareText, setShareText] = useState(defaultText)
  const getShareLink = async () => {
    setShareText("Copying...")
    try {
      const { code } = await getChecklistShareCode(checklistID)
      setShareText("Copied!")
      navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_URL}/share/${code}`,
      )
      setTimeout(() => setShowShareDialog(false), 2000)
      setTimeout(() => setShareText(defaultText), 3000)
    } catch (error) {
      Honeybadger.notify(error as Error)
    }
  }

  return (
    <Dialog
      open={showShareDialog}
      onClose={setShowShareDialog}
      className="relative z-10"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-slate-500 bg-opacity-75 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                <ArrowsRightLeftIcon
                  className="h-6 w-6 text-green-600"
                  aria-hidden="true"
                />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Share {title}
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Sharing is simple! Click the button below to copy a sharable
                    link to your clipboard. Send it to whoever you like! They'll
                    be able to do everything you can with this list, except
                    delete it.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={getShareLink}
                className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
              >
                {shareText}
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

export default ShareDialog
