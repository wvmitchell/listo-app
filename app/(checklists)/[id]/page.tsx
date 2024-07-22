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
} from "@/api/checklistAPI"
import ChecklistMenu from "./components/ChecklistMenu"
import Item from "./components/Item"
import NewItemForm from "./components/NewItemForm"

type ChecklistItem = {
  id: string
  content: string
  checked: boolean
  ordering: number
  created_at: string
  updated_at: string
}

type ChecklistParams = {
  id: string
}

const Checklist = ({ params }: { params: ChecklistParams }) => {
  const checklistID = params.id
  const [title, setTitle] = useState("")
  const [items, setItems] = useState<ChecklistItem[]>([])
  const [locked, setLocked] = useState(true)
  const [draggingIndex, setDraggingIndex] = useState(-1)

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

  const debouncedUpdateChecklistTitle = useCallback(
    debounce(
      (newTitle: string, locked: boolean) =>
        updateChecklistMutation.mutate({
          checklistID,
          title: newTitle,
          locked: locked,
        }),
      500,
    ),
    [checklistID],
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
    debouncedUpdateChecklistTitle(e.target.value, locked)
  }

  function handleNewItem(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    let form = e.target as HTMLFormElement
    let formData = new FormData(form)
    let ordering = items.length ? items[items.length - 1].ordering + 1 : 0
    newItemMutation.mutate({
      checklistID,
      content: formData.get("new-item") as string,
      ordering,
    })
    form.reset()
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

  function handleDragStart(e: React.DragEvent<HTMLDivElement>, index: number) {
    setDraggingIndex(index)
    let target = e.target as HTMLDivElement
    let rect = target.getBoundingClientRect()
    let clone = target.cloneNode(true) as HTMLDivElement
    clone.style.position = "absolute"
    clone.style.top = "-9999px"
    clone.style.width = `${rect.width}px`
    clone.style.height = `${rect.height}px`
    clone.classList.add("drag-clone")
    document.body.appendChild(clone)
    e.dataTransfer.setDragImage(
      clone,
      e.clientX - rect.left,
      e.clientY - rect.top,
    )
    target.classList.add("opacity-0")
  }

  function handleDragEnter(e: React.DragEvent<HTMLDivElement>, index: number) {
    e.preventDefault()
    if (draggingIndex === -1) return
    const itemsCopy = [...items]
    const [draggedItem] = itemsCopy.splice(draggingIndex, 1)
    itemsCopy.splice(index, 0, draggedItem)
    setDraggingIndex(index)
    setItems(itemsCopy)
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
  }

  function handleDragEnd(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    let target = e.target as HTMLDivElement
    target.classList.remove("opacity-0")
    document.body.querySelector(".drag-clone")?.remove()
    setDraggingIndex(-1)
    updateItemOrder()
  }

  function updateItemOrder() {
    items.forEach((item, index) => {
      if (item.ordering !== index) {
        updateItemMutation.mutate({
          checklistID,
          itemID: item.id,
          ordering: index,
          checked: item.checked,
          content: item.content,
        })
        item.ordering = index
      }
    })
  }

  if (isPending) return <div>Loading...</div>

  if (isError) return <div>Error: {error.message}</div>

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
      {items.map((item: ChecklistItem, index: number) => (
        <div
          key={item.id}
          onDragStart={(event) => handleDragStart(event, index)}
          onDragEnter={(event) => handleDragEnter(event, index)}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          className={`${locked ? "" : "cursor-move"}`}
        >
          <Item
            updateItemMutation={updateItemMutation}
            checklistID={checklistID}
            item={item}
            locked={locked}
          />
        </div>
      ))}
      {locked ? null : <NewItemForm handleNewItem={handleNewItem} />}
    </div>
  )
}

export default Checklist
