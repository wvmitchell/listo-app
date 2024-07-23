import { useState } from "react"
import Item from "./Item"
import type { ChecklistItem } from "@/utils/types"

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
  const [draggingIndex, setDraggingIndex] = useState(-1)

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

  return (
    <div>
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
    </div>
  )
}

export default ItemList
