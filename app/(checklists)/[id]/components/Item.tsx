"use client"

import { useState, useEffect, useCallback } from "react"
import { debounce } from "lodash"
import type { ChecklistItem } from "@/utils/types"

type ItemProps = {
  checklistID: string
  item: ChecklistItem
  locked: boolean
  updateItemMutation: any
}

function Item({ checklistID, item, locked, updateItemMutation }: ItemProps) {
  const [isChecked, setIsChecked] = useState(item.checked)
  const [content, setContent] = useState(item.content)
  const [updating, setUpdating] = useState(false)

  const updateItemCallback = useCallback(
    debounce((content: string) => {
      updateItemMutation.mutate({
        checklistID,
        itemID: item.id,
        checked: item.checked,
        content,
        ordering: item.ordering,
      })
    }, 500),
    [],
  )

  // This effect will focus the input field when the item is set to updating.
  // This ensures the caret appears in the input field when the user clicks on the item.
  useEffect(() => {
    if (updating) {
      const input = document.getElementById(`item-input-${item.id}`)
      input?.focus()
    }
  }, [updating, item.id])

  useEffect(() => {
    setIsChecked(item.checked)
  }, [item.checked])

  function toggleItem(e: React.ChangeEvent<HTMLInputElement>) {
    const checked = e.target.checked
    setIsChecked(checked)
    updateItemMutation.mutate({
      checklistID,
      itemID: item.id,
      checked,
      content: item.content,
      ordering: item.ordering,
    })
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
    >
      <input
        type="checkbox"
        id={item.id}
        onChange={toggleItem}
        checked={isChecked}
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
    </div>
  )
}

export default Item
