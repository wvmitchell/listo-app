import { useState, useEffect, useRef, useCallback } from "react"
import Item from "./Item"
import type { ChecklistItem } from "@/utils/types"
import { compact } from "lodash"
import styles from "../css/styles.module.css"

type ItemListProps = {
  items: ChecklistItem[]
  locked: boolean
  checklistID: string
  updateItemMutation: any
  setItems: (items: ChecklistItem[]) => void
}

const ItemList = ({
  items,
  locked,
  checklistID,
  updateItemMutation,
  setItems,
}: ItemListProps) => {
  // Note: draggingIndex is used when reordering is happening in a desktop environment.
  // touchedItem is used when reordering is happening in a touch environment (mobile).
  const [draggingIndex, setDraggingIndex] = useState(-1)
  const [touchedItem, setTouchedItem] = useState<ChecklistItem | null>(null)
  const touchOffset = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (touchedItem) {
      document.body.classList.add(styles.disableMovement)
    } else {
      document.body.classList.remove(styles.disableMovement)
    }

    return () => {
      document.body.classList.remove(styles.disableMovement)
    }
  }, [touchedItem])

  useEffect(() => {
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

    updateItemOrder()
  }, [items, checklistID, updateItemMutation])

  // All these touch event handlers need to be in the callback because they need access to
  // the items state, and the event handlers need to be active, so that the default behavior
  // of the touch events can be prevented.
  const touchEventsCallback = useCallback(
    (node: HTMLDivElement) => {
      function handleTouchStart(e: TouchEvent) {
        // can't reorder items if the list is locked
        if (locked) return

        // return unless the touch even happened on the move-icon
        const eventTarget = e.target as HTMLDivElement
        if (!eventTarget.dataset.moveIcon) return

        // collect the touch and the element
        const touch = e.touches[0]
        const target = e.currentTarget as HTMLDivElement

        // collect the item being touched and set it in state
        let foundItem = items.find((item) => item.id === target.dataset.itemId)
        foundItem && setTouchedItem(foundItem)

        // get the dimensions and position of the element
        const rect = target.getBoundingClientRect()

        // create a clone of the targar element and position it off the screen
        const clone = target.cloneNode(true) as HTMLDivElement
        clone.style.position = "absolute"
        clone.style.top = "-9999px"
        clone.style.width = `${rect.width}px`
        clone.style.height = `${rect.height}px`
        clone.classList.add("drag-clone")
        document.body.appendChild(clone)

        // set the touch offset to determine the position of the touch relative to the
        // top left corner of the element
        touchOffset.current = {
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
        }

        e.preventDefault()
      }

      function handleTouchMove(e: TouchEvent) {
        if (!touchedItem) return

        // collect touch and element being dragged
        const touch = e.touches[0]
        const target = e.currentTarget as HTMLDivElement

        // hide the original element
        target.classList.add("opacity-0")

        // collect the clone element and set its position directly over the touch
        const clone = document.body.querySelector(
          ".drag-clone",
        ) as HTMLDivElement
        clone.style.position = "absolute"
        clone.style.left = `${touch.clientX - touchOffset.current.x}px`
        clone.style.top = `${touch.clientY - touchOffset.current.y + window.scrollY}px`

        // collect all the item dom elements and convert them to an array
        const container = document.getElementById("item-container")
        const itemsArray = Array.from(container?.children || [])

        // loop through the items to determine placement of the target element
        itemsArray.forEach((item) => {
          // find the deminsions and position of the item
          const rect = item.getBoundingClientRect()
          const middleY = rect.top + rect.height / 2

          // if the position of the touch is within the top half of the item, place the target element before the item
          // if the position of the touch is within the bottom half of the item, place the target element after the item
          // otherwise, do nothing
          if (touch.clientY > rect.top && touch.clientY < middleY) {
            container?.insertBefore(target, item)
          } else if (touch.clientY > middleY && touch.clientY < rect.bottom) {
            container?.insertBefore(target, item.nextSibling)
          }
        })

        // map over the itemsArray and use the order to collect the new order of the items
        const newItems = itemsArray.map((domElements) => {
          const domItem = domElements as HTMLDivElement
          return items.find((item) => item.id === domItem.dataset.itemId)
        })

        // update the items state with the new order of the items
        setItems(compact(newItems))

        e.preventDefault()
      }

      function handleTouchEnd(e: TouchEvent) {
        if (!touchedItem) return

        // show the original element
        let target = e.currentTarget as HTMLDivElement
        target.classList.remove("opacity-0")

        // remove the clone element
        document.body.querySelector(".drag-clone")?.remove()

        // reset the state
        setTouchedItem(null)

        e.preventDefault()
      }

      if (node) {
        node.addEventListener("touchstart", handleTouchStart, {
          passive: false,
        })
        node.addEventListener("touchmove", handleTouchMove, { passive: false })
        node.addEventListener("touchend", handleTouchEnd, { passive: false })
        node.addEventListener("touchcancel", handleTouchEnd, { passive: false })
      }
    },
    [items, locked, setItems, touchedItem],
  )

  function handleDragStart(e: React.DragEvent<HTMLDivElement>, index: number) {
    if (locked) return
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
  }

  return (
    <div id="item-container">
      {items.map((item: ChecklistItem, index: number) => (
        <div
          key={item.id}
          ref={touchEventsCallback}
          data-item-id={item.id}
          onDragStart={(event) => handleDragStart(event, index)}
          onDragEnter={(event) => handleDragEnter(event, index)}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          className={`${locked ? "" : "cursor-move"}`}
          draggable={!locked}
          data-index={index}
        >
          <Item
            updateItemMutation={updateItemMutation}
            checklistID={checklistID}
            item={item}
            locked={locked}
          />
        </div>
      ))}
    </div>
  )
}

export default ItemList
