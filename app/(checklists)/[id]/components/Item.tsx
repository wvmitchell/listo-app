"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { debounce } from "lodash"
import { Bars2Icon } from "@heroicons/react/24/solid"
import type { ChecklistItem } from "@/utils/types"
import { checkForEnter } from "@/utils/domUtils"

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
  const textareaRef = useRef<HTMLSpanElement>(null)

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
      if (input) {
        input.innerText = content
        input.focus()
        moveCursorToEnd(input)
      }
    }
  }, [updating, item.id])

  useEffect(() => {
    setIsChecked(item.checked)
  }, [item.checked])

  function moveCursorToEnd(element: HTMLElement) {
    const range = document.createRange()
    const selection = window.getSelection()
    range.selectNodeContents(element)
    range.collapse(false) // Move the cursor to the end
    selection?.removeAllRanges()
    selection?.addRange(range)
  }

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
    setContent(e.target.innerText)
    updateItemCallback(e.target.innerText)
  }

  function handleClickItem() {
    if (locked || isChecked) return
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
        <form onSubmit={() => setUpdating(false)} className="m-0 w-full">
          <span
            id={`item-input-${item.id}`}
            ref={textareaRef}
            onKeyDown={(e) => checkForEnter(e, () => setUpdating(false))}
            onInput={handleContentChange}
            onBlur={() => setUpdating(false)}
            className="mx-4 block w-auto cursor-text resize-none border-0 p-0 text-base leading-6 outline-none ring-0 focus:ring-0 active:ring-0"
            contentEditable
          ></span>
          <input type="text" value={content} hidden readOnly />
        </form>
      ) : (
        <p
          className={`mx-4 ${locked || isChecked ? "cursor-default" : "cursor-pointer"} w-full min-w-10 whitespace-pre-wrap text-base ${isChecked ? "italic text-gray-400 line-through" : ""}`}
          onClick={handleClickItem}
        >
          {content}
        </p>
      )}
      <div
        className={`-my-3 -mr-3 ml-auto h-12 content-center ${locked ? "hidden" : ""}`}
        data-move-icon
      >
        <Bars2Icon
          className="h-6 w-12 cursor-move text-slate-500"
          aria-hidden="true"
          data-move-icon
        />
      </div>
    </div>
  )
}

export default Item
