"use client"

import { useCallback, useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { debounce } from "lodash"
import {
  createItem,
  getChecklist,
  toggleAllItems,
  updateChecklist,
  updateItem,
  deleteItem,
} from "@/utils/checklistAPI"
import type { ChecklistItem } from "@/utils/types"
import ShareDialog from "@/app/components/ShareDialog"
import ChecklistMenu from "./ChecklistMenu"
import NewItemForm from "./NewItemForm"
import ItemList from "./ItemList"

type ChecklistParams = {
  id: string
}

type ChecklistProps = {
  params: ChecklistParams
  shared: boolean
}

const Checklist = ({ params, shared }: ChecklistProps) => {
  const checklistID = params.id
  const [title, setTitle] = useState("")
  const [items, setItems] = useState<ChecklistItem[]>([])
  const [locked, setLocked] = useState(true)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const router = useRouter()

  const queryClient = useQueryClient()
  const { isPending, data, error, isSuccess } = useQuery({
    queryKey: ["checklist", checklistID],
    queryFn: () => getChecklist(checklistID, shared),
    staleTime: 1000 * 60 * 5, // 5 minutes,
  })

  const updateChecklistMutation = useMutation({
    mutationFn: (variables: {
      checklistID: string
      title: string
      locked: boolean
      shared: boolean
    }) => {
      return updateChecklist(
        variables.checklistID,
        variables.title,
        variables.locked,
        variables.shared,
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist"] })
    },
  })

  const newItemMutation = useMutation({
    mutationFn: (variables: {
      checklistID: string
      content: string
      ordering: number
      shared: boolean
    }) => {
      return createItem(
        variables.checklistID,
        variables.content,
        variables.ordering,
        variables.shared,
      )
    },
    onMutate: (variables: {
      checklistID: string
      content: string
      ordering: number
      shared: boolean
    }) => {
      const previousData = queryClient.getQueryData(["checklist", checklistID])

      queryClient.setQueryData(["checklist", checklistID], (oldData: any) => {
        const nextValues = [...oldData.items, { ...variables, id: "temp" }]
        return { ...oldData, items: nextValues }
      })

      return { previousData }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist"] })
    },
  })

  const updateItemMutation = useMutation({
    mutationFn: (variables: {
      checklistID: string
      itemID: string
      checked: boolean
      content: string
      ordering: number
      shared: boolean
    }) => {
      return updateItem(
        variables.checklistID,
        variables.itemID,
        variables.checked,
        variables.content,
        variables.ordering,
        variables.shared,
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist"] })
    },
  })

  const toggleAllMutation = useMutation({
    mutationFn: (variables: {
      checklistID: string
      checked: boolean
      shared: boolean
    }) => {
      return toggleAllItems(
        variables.checklistID,
        variables.checked,
        variables.shared,
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist"] })
    },
  })

  const deleteCompletedItemsMutation = useMutation({
    mutationFn: (variables: {
      checklistID: string
      itemIDs: string[]
      shared: boolean
    }) => {
      return Promise.all(
        variables.itemIDs.map((id) => {
          return deleteItem(variables.checklistID, id, shared)
        }),
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist"] })
    },
  })

  const updateTitleCallback = useCallback(
    debounce((title: string, locked: boolean) => {
      updateChecklistMutation.mutate({
        checklistID,
        title,
        locked,
        shared,
      })
    }, 1000),
    [],
  )

  useEffect(() => {
    if (isSuccess && data) {
      setTitle(data.checklist.title)
      setLocked(data.checklist.locked)
      let sorted = data.items.sort(
        (a: ChecklistItem, b: ChecklistItem) => a.ordering - b.ordering,
      )
      setItems(sorted)
    }
  }, [isSuccess, data])

  function handleUpdateChecklistTitle(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value)
    updateTitleCallback(e.target.value, locked)
  }

  function handleNewItem(content: string) {
    let ordering = items.length ? items[items.length - 1].ordering + 1 : 0
    newItemMutation.mutate({
      checklistID,
      content,
      ordering,
      shared,
    })
  }

  function handleLockChecklist() {
    setLocked(!locked)
    updateChecklistMutation.mutate({
      checklistID,
      title,
      locked: !locked,
      shared,
    })
  }

  function handleToggleAll(toggle: boolean) {
    toggleAllMutation.mutate({ checklistID, checked: toggle, shared })
  }

  function handleDeleteCompleted() {
    let itemIDs = items.filter((item) => item.checked).map((item) => item.id)
    deleteCompletedItemsMutation.mutate({ checklistID, itemIDs, shared })
  }

  if (isPending) return <div>Loading...</div>

  if (error) router.push("/")

  return (
    <div>
      <div className="mb-1 grid grid-cols-[1fr_auto]">
        <input
          type="text"
          name="checklist-name"
          value={title}
          onChange={handleUpdateChecklistTitle}
          className="m-0 w-full border-0 bg-transparent p-0 text-xl font-bold outline-none ring-0 focus:outline-none focus:ring-0 active:ring-0"
          disabled={locked}
        />
        <ChecklistMenu
          locked={locked}
          handleLockChecklist={handleLockChecklist}
          handleToggleAll={handleToggleAll}
          handleDeleteCompleted={handleDeleteCompleted}
          setShowShareDialog={setShowShareDialog}
        />
      </div>
      <ItemList
        items={items}
        locked={locked}
        updateItemMutation={updateItemMutation}
        checklistID={checklistID}
        setItems={setItems}
        shared={shared}
      />
      {locked ? null : <NewItemForm handleNewItem={handleNewItem} />}
      <ShareDialog
        title={title}
        showShareDialog={showShareDialog}
        setShowShareDialog={setShowShareDialog}
        checklistID={checklistID}
      />
    </div>
  )
}

export default Checklist
