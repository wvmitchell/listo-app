import { useState, useRef } from "react"
import { PlusCircleIcon } from "@heroicons/react/24/outline"
import { checkForEnter } from "@/utils/domUtils"

type NewItemFormProps = {
  handleNewItem: (content: string) => void
}

const NewItemForm = ({ handleNewItem }: NewItemFormProps) => {
  const [content, setContent] = useState("")
  const textareaRef = useRef<HTMLSpanElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

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
    textareaRef.current?.focus()
  }

  function submitForm() {
    formRef.current?.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    )
  }

  return (
    <div className="mt-1 grid min-h-12 w-full grid-cols-[auto_1fr] items-center rounded-sm bg-white shadow-sm">
      <PlusCircleIcon className="mx-2 size-[24px] text-slate-700" />
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="grid w-full grid-cols-[1fr_auto] gap-2 py-3 pr-3"
      >
        <span
          ref={textareaRef}
          role="textbox"
          onInput={handleSpanInput}
          onKeyDown={(e) => checkForEnter(e, submitForm)}
          className="block w-full resize-none overflow-hidden rounded-sm border-0 p-0 px-1 text-base leading-6 outline-none ring-0 focus:ring-0 active:ring-0"
          contentEditable
        ></span>
        <input name="new-item" type="text" value={content} hidden readOnly />
        <div className="flex flex-col justify-center">
          <button
            type="submit"
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
