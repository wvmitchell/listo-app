import { useState, useEffect, useRef } from "react"
import { PlusCircleIcon } from "@heroicons/react/24/outline"

type NewItemFormProps = {
  handleNewItem: (e: React.FormEvent<HTMLFormElement>) => void
}

const NewItemForm = ({ handleNewItem }: NewItemFormProps) => {
  const [formOpen, setFormOpen] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (showForm) {
      inputRef.current?.focus()
    }
  }, [showForm])

  function handleFormToggle() {
    setFormOpen(!formOpen)
  }

  function handleTranistionEnd() {
    setShowForm(formOpen)
  }

  return (
    <div
      className={`mt-1 grid grid-cols-[auto_1fr] items-center rounded-sm bg-white shadow-sm transition-width delay-150 ease-in-out ${formOpen ? "w-full" : "w-10"}`}
      onTransitionEnd={handleTranistionEnd}
    >
      <button className="py-[0.65rem] pl-2 pr-[7px]" onClick={handleFormToggle}>
        <PlusCircleIcon className="size-[24px] text-slate-700" />
      </button>
      <form
        onSubmit={handleNewItem}
        hidden={!showForm || !formOpen}
        className="grid w-full grid-cols-[1fr_auto] gap-2 py-2 pr-3"
      >
        <input
          ref={inputRef}
          type="text"
          name="new-item"
          hidden={!showForm || !formOpen}
          className="rounded-sm border-0 p-0 px-1 text-sm outline-none ring-0 focus:ring-0 active:ring-0"
        />
        <button
          type="submit"
          hidden={!showForm || !formOpen}
          className="rounded-sm border border-slate-300 px-2 text-sm"
        >
          Add
        </button>
      </form>
    </div>
  )
}

export default NewItemForm
