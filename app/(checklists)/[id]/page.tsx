"use client"

import { useCallback, useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { debounce } from "lodash"
import {
  createItem,
  getChecklist,
  toggleAllItems,
  updateChecklist,
  updateItem,
  deleteItem,
} from "@/utils/checklistAPI"
import ChecklistMenu from "./components/ChecklistMenu"
import NewItemForm from "./components/NewItemForm"
import ItemList from "./components/ItemList"
import type { ChecklistItem } from "@/utils/types"

type ChecklistParams = {
  id: string
}

const Checklist = ({ params }: { params: ChecklistParams }) => {
  const checklistID = params.id
  const [title, setTitle] = useState("")
  const [items, setItems] = useState<ChecklistItem[]>([])
  const [locked, setLocked] = useState(true)

  const queryClient = useQueryClient()
  const { isPending, isError, data, error, isSuccess } = useQuery({
    queryKey: ["checklist", checklistID],
    queryFn: () => getChecklist(checklistID),
    staleTime: 1000 * 60 * 5, // 5 minutes,
  })

  const updateChecklistMutation = useMutation({
    mutationFn: (variables: {
      checklistID: string
      title: string
      locked: boolean
    }) => {
      return updateChecklist(
        variables.checklistID,
        variables.title,
        variables.locked,
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
    }) => {
      return createItem(
        variables.checklistID,
        variables.content,
        variables.ordering,
      )
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
    }) => {
      return updateItem(
        variables.checklistID,
        variables.itemID,
        variables.checked,
        variables.content,
        variables.ordering,
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist"] })
    },
  })

  const toggleAllMutation = useMutation({
    mutationFn: (variables: { checklistID: string; checked: boolean }) => {
      return toggleAllItems(variables.checklistID, variables.checked)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist"] })
    },
  })

  const deleteCompletedItemsMutation = useMutation({
    mutationFn: (variables: { checklistID: string; itemIDs: string[] }) => {
      return Promise.all(
        variables.itemIDs.map((id) => {
          return deleteItem(variables.checklistID, id)
        }),
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist"] })
    },
  })

  const updateTitleCallback = useCallback(
    debounce((title: string, locked: boolean) => {
      console.log("running")
      updateChecklistMutation.mutate({
        checklistID,
        title,
        locked,
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
    })
  }

  function handleLockChecklist() {
    setLocked(!locked)
    updateChecklistMutation.mutate({ checklistID, title, locked: !locked })
  }

  function handleToggleAll(toggle: boolean) {
    toggleAllMutation.mutate({ checklistID, checked: toggle })
  }

  function handleDeleteCompleted() {
    let itemIDs = items.filter((item) => item.checked).map((item) => item.id)
    deleteCompletedItemsMutation.mutate({ checklistID, itemIDs })
  }

  if (isPending) return <div>Loading...</div>

  if (isError) {
    throw error
  }

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
        />
      </div>
      <ItemList
        items={items}
        locked={locked}
        updateItemMutation={updateItemMutation}
        checklistID={checklistID}
        setItems={setItems}
      />
      {locked ? null : <NewItemForm handleNewItem={handleNewItem} />}
    </div>
  )
}

export default Checklist
