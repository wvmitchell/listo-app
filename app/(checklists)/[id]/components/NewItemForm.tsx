import { useState, useEffect, useRef } from "react"
import { PlusCircleIcon } from "@heroicons/react/24/outline"

type NewItemFormProps = {
  handleNewItem: (e: React.FormEvent<HTMLFormElement>) => void
}

const NewItemForm = ({ handleNewItem }: NewItemFormProps) => {
  const [formOpen, setFormOpen] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [content, setContent] = useState("")
  const textareaRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (showForm) {
      textareaRef.current?.focus()
    }
  }, [showForm])

  function handleFormToggle() {
    setFormOpen(!formOpen)
  }

  function handleTranistionEnd() {
    setShowForm(formOpen)
  }

  function handleSpanInput(e: React.FormEvent<HTMLSpanElement>) {
    let span = e.target as HTMLSpanElement
    setContent(span.innerText)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    handleNewItem(e)
    if (textareaRef.current) {
      textareaRef.current.innerText = ""
    }
    setContent("")
  }

  return (
    <div
      className={`mb-4 mt-1 grid grid-cols-[auto_1fr] items-center rounded-sm bg-white shadow-sm transition-width delay-150 ease-in-out ${formOpen ? "w-full" : "w-10"}`}
      onTransitionEnd={handleTranistionEnd}
    >
      <button className="py-[0.65rem] pl-2 pr-[8px]" onClick={handleFormToggle}>
        <PlusCircleIcon className="size-[24px] text-slate-700" />
      </button>
      <form
        onSubmit={handleSubmit}
        hidden={!showForm || !formOpen}
        className="grid w-full grid-cols-[1fr_auto] gap-2 py-3 pr-3"
      >
        {/* This span serves the purpose of having a resizable text input, but the 
            hidden input is what is handled in the form submission */}
        <span
          ref={textareaRef}
          role="textbox"
          hidden={!showForm || !formOpen}
          onInput={handleSpanInput}
          className="block w-full resize-none overflow-hidden rounded-sm border-0 p-0 px-1 text-sm leading-5 outline-none ring-0 focus:ring-0 active:ring-0"
          contentEditable
        ></span>
        <input name="new-item" type="text" value={content} hidden />
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
