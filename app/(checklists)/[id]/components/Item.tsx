"use client"

import { useState, useEffect, useCallback } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { TrashIcon } from "@heroicons/react/24/solid"
import { debounce } from "lodash"
import { deleteItem } from "@/api/checklistAPI"

type ChecklistItem = {
  id: string
  content: string
  checked: boolean
  ordering: number
  created_at: string
  updated_at: string
}

type ItemProps = {
  checklistID: string
  item: ChecklistItem
  locked: boolean
  updateItemMutation: any
}

function Item({ checklistID, item, locked, updateItemMutation }: ItemProps) {
  const [updating, setUpdating] = useState(false)
  const [content, setContent] = useState(item.content)
  const queryClient = useQueryClient()

  const deleteItemMutation = useMutation({
    mutationFn: (variables: { checklistID: string; itemID: string }) => {
      return deleteItem(variables.checklistID, variables.itemID)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist"] })
    },
  })

  useEffect(() => {
    if (updating) {
      const input = document.getElementById(`item-input-${item.id}`)
      input?.focus()
    }
  }, [updating, item.id])

  const updateItemCallback = useCallback(
    debounce((content: string) => {
      updateItemMutation.mutate({
        checklistID,
        itemID: item.id,
        checked: item.checked,
        content,
        ordering: item.ordering,
      }),
        500
    }),
    [updateItemMutation],
  )

  function toggleItem(e: React.ChangeEvent<HTMLInputElement>) {
    const checked = e.target.checked
    updateItemMutation.mutate({
      checklistID,
      itemID: item.id,
      checked,
      content: item.content,
      ordering: item.ordering,
    })
  }

  function handleDeleteItem() {
    deleteItemMutation.mutate({ checklistID, itemID: item.id })
  }

  function handleContentChange(e: React.ChangeEvent<HTMLInputElement>) {
    setContent(e.target.value)
    updateItemCallback(e.target.value)
  }

  function handleClickItem() {
    if (locked) return
    setUpdating(true)
  }

  return (
    <div
      key={item.id}
      className="mt-1 flex flex-row rounded-sm bg-white p-3 shadow-sm"
      draggable={!locked}
    >
      <input
        type="checkbox"
        id={item.id}
        onChange={toggleItem}
        checked={item.checked}
        className="blur:ring-0 mt-1 h-4 w-4 rounded border-gray-300 text-slate-600 focus:ring-slate-600"
      />
      {updating ? (
        <form
          onSubmit={() => setUpdating(false)}
          className="m-0 w-full text-sm leading-5"
        >
          <input
            id={`item-input-${item.id}`}
            type="text"
            value={content}
            className="ml-4 w-full border-0 p-0 text-sm outline-none focus:ring-0 active:ring-0"
            onChange={handleContentChange}
            onBlur={() => setUpdating(false)}
          />
        </form>
      ) : (
        <p
          className={`ml-4 ${locked ? "cursor-default" : "cursor-pointer"} text-sm`}
          onClick={handleClickItem}
        >
          {content}
        </p>
      )}
      {locked ? null : (
        <button id={item.id} onClick={handleDeleteItem} className="ml-auto">
          <TrashIcon className="ml-4 size-4" />
        </button>
      )}
    </div>
  )
}

export default Item
