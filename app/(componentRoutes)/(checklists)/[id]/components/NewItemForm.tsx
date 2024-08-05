import { useState, useEffect, useRef } from "react"
import { PlusCircleIcon } from "@heroicons/react/24/outline"
import { checkForEnter } from "@/utils/domUtils"

type NewItemFormProps = {
  handleNewItem: (content: string) => void
}

const NewItemForm = ({ handleNewItem }: NewItemFormProps) => {
  const [formOpen, setFormOpen] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [content, setContent] = useState("")
  const textareaRef = useRef<HTMLSpanElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

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
    e.preventDefault()
    if (textareaRef.current) {
      textareaRef.current.innerText = ""
    }
    handleNewItem(content)
    setContent("")
  }

  function submitForm() {
    formRef.current?.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    )
  }

  return (
    <div
      className={`mt-1 grid grid-cols-[auto_1fr] items-center rounded-sm bg-white shadow-sm transition-width delay-150 ease-in-out ${formOpen ? "w-full" : "w-10"} min-h-12`}
      onTransitionEnd={handleTranistionEnd}
    >
      <button className="pl-2 pr-[8px]" onClick={handleFormToggle}>
        <PlusCircleIcon className="size-[24px] text-slate-700" />
      </button>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        hidden={!showForm || !formOpen}
        className="grid w-full grid-cols-[1fr_auto] gap-2 py-3 pr-3"
      >
        <span
          ref={textareaRef}
          role="textbox"
          hidden={!showForm || !formOpen}
          onInput={handleSpanInput}
          onKeyDown={(e) => checkForEnter(e, submitForm)}
          className={`block w-full resize-none overflow-hidden rounded-sm border-0 p-0 px-1 text-base leading-6 outline-none ring-0 focus:ring-0 active:ring-0 ${!showForm || !formOpen ? "hidden" : ""}`}
          contentEditable
        ></span>
        <input name="new-item" type="text" value={content} hidden readOnly />
        <div className="flex flex-col justify-center">
          <button
            type="submit"
            hidden={!showForm || !formOpen}
            className="rounded-sm border border-slate-300 px-2 text-sm"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewItemForm
