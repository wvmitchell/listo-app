"use client"

import { useCallback, useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { debounce } from "lodash"
import {
  createItem,
  getChecklist,
  updateChecklist,
  updateItem,
  deleteItem,
} from "@/utils/checklistAPI"
import type { ChecklistItem } from "@/utils/types"
import { useAuth } from "@/app/context/AuthContext"
import ShareDialog from "@/app/components/ShareDialog"
import ChecklistMenu from "./ChecklistMenu"
import NewItemForm from "./NewItemForm"
import ItemList from "./ItemList"

type ChecklistParams = {
  id: string
}

type ChecklistProps = {
  params: ChecklistParams
}

const Checklist = ({ params }: ChecklistProps) => {
  const checklistID = params.id
  const [title, setTitle] = useState("")
  const [items, setItems] = useState<ChecklistItem[]>([])
  const [locked, setLocked] = useState(true)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const { token } = useAuth()
  const router = useRouter()

  const queryClient = useQueryClient()
  const { isPending, data, error, isSuccess } = useQuery({
    queryKey: ["checklist", checklistID],
    queryFn: () => getChecklist(checklistID, token),
    staleTime: 1000 * 60 * 5, // 5 minutes,
    refetchInterval: 1000 * 10, // 10 seconds
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
        token,
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
        token,
      )
    },
    onMutate: (variables: {
      checklistID: string
      content: string
      ordering: number
    }) => {
      const previousData = queryClient.getQueryData(["checklist", checklistID])

      queryClient.setQueryData(["checklist", checklistID], (oldData: any) => {
        console.log("oldData", oldData)
        const nextValues = [...oldData.items, { ...variables, id: "temp" }]
        return { ...oldData, items: nextValues }
      })

      return { previousData }
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
        token,
      )
    },
    onMutate: (variables: {
      checklistID: string
      itemID: string
      checked: boolean
      content: string
      ordering: number
    }) => {
      const previousData = queryClient.getQueryData(["checklist", checklistID])

      queryClient.setQueryData(["checklist", checklistID], (oldData: any) => {
        const nextValues = oldData.items.map((item: ChecklistItem) => {
          if (item.id === variables.itemID) {
            return {
              ...item,
              checked: variables.checked,
              content: variables.content,
              ordering: variables.ordering,
            }
          }
          return item
        })
        return { ...oldData, items: nextValues }
      })

      return { previousData }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist"] })
    },
  })

  const toggleAllMutation = useMutation({
    mutationFn: (variables: {
      checklistID: string
      items: ChecklistItem[]
      checked: boolean
    }) => {
      return Promise.all(
        items.map((item) => {
          return updateItem(
            variables.checklistID,
            item.id,
            variables.checked,
            item.content,
            item.ordering,
            token,
          )
        }),
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist"] })
    },
  })

  const deleteCompletedItemsMutation = useMutation({
    mutationFn: (variables: {
      checklistID: string
      items: ChecklistItem[]
    }) => {
      return Promise.all(
        variables.items.map((item) => {
          return deleteItem(variables.checklistID, item.id, token)
        }),
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist"] })
    },
  })

  const updateTitleCallback = useCallback(
    debounce((title: string, locked: boolean) => {
      updateChecklistMutation.mutate({
        checklistID,
        title,
        locked,
      })
    }, 1000),
    [],
  )

  useEffect(() => {
    if (isSuccess && data) {
      setTitle(data.title)
      setLocked(data.locked)
      let sorted = data.items.sort(
        (a: ChecklistItem, b: ChecklistItem) => a.ordering - b.ordering,
      )
      setItems(sorted)
    }
  }, [isSuccess, data])

  function handleUpdateChecklistTitle(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value)
    updateTitleCallback(e.target.value, locked)
  }

  function handleNewItem(content: string) {
    let ordering = items.length ? items[items.length - 1].ordering + 1 : 0
    newItemMutation.mutate({
      checklistID,
      content,
      ordering,
    })
  }

  function handleLockChecklist() {
    setLocked(!locked)
    updateChecklistMutation.mutate({
      checklistID,
      title,
      locked: !locked,
    })
  }

  function handleToggleAll(toggle: boolean) {
    toggleAllMutation.mutate({ checklistID, items, checked: toggle })
  }

  function handleDeleteCompleted() {
    let completed = items.filter((item) => item.checked)
    deleteCompletedItemsMutation.mutate({
      checklistID,
      items: completed,
    })
  }

  if (isPending) return <div>Loading...</div>

  if (error) router.push("/")

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
          setShowShareDialog={setShowShareDialog}
        />
      </div>
      <ItemList
        items={items}
        locked={locked}
        updateItemMutation={updateItemMutation}
        checklistID={checklistID}
        setItems={setItems}
      />
      {locked ? null : <NewItemForm handleNewItem={handleNewItem} />}
      <ShareDialog
        title={title}
        showShareDialog={showShareDialog}
        setShowShareDialog={setShowShareDialog}
        checklistID={checklistID}
      />
    </div>
  )
}

export default Checklist
