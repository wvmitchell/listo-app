"use server"

import Honeybadger from "@honeybadger-io/js"

Honeybadger.configure({
  apiKey: process.env.HONEYBADGER_API_KEY,
})

/**
 * Fetches all checklists for the current user.
 * @param token The user's access token.
 * @returns An array of checklists.
 * @throws Error if the request fails.
 * @example
 * ```typescript
 * const checklists = await getChecklists()
 * ```
 */
async function getChecklists(token: string | null) {
  const res = await fetch(`${process.env.BASE_URL}/checklists`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  })

  const body = await res.json()
  if (!res.ok) {
    Honeybadger.notify(new Error(`Failed to get checklists: ${body.message}`))
    throw new Error(`Failed to get checklists: ${res.status}`)
  }
  return body
}

/**
 * Fetches a checklist by ID.
 * @param checklistID The ID of the checklist.
 * @param token The user's access token.
 * @returns The checklist.
 * @throws Error if the request fails.
 * @example
 * ```typescript
 * const checklist = await getChecklist("123")
 * ```
 */
async function getChecklist(checklistID: string, token: string | null) {
  const path = `/checklists/${checklistID}`
  const res = await fetch(`${process.env.BASE_URL}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  const body = await res.json()
  if (!res.ok) {
    Honeybadger.notify(new Error(`Failed to get checklist: ${body.message}`))
    throw new Error(`Failed to get checklist: ${res.status}`)
  }
  return body.checklist
}

/**
 * Creates a new checklist.
 * @param token The user's access token.
 * @returns The new checklist.
 * @throws Error if the request fails.
 * @example
 * ```typescript
 * const checklist = await createChecklist()
 * ```
 */
async function createChecklist(token: string | null) {
  const res = await fetch(`${process.env.BASE_URL}/checklists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title: "New Listo (click to edit)" }),
  })

  const body = await res.json()
  if (!res.ok) {
    Honeybadger.notify(new Error(`Failed to create checklist: ${body.message}`))
    throw new Error(`Failed to create checklist: ${res.status}`)
  }

  return body
}

/**
 * Updates a checklist.
 * @param checklistID The ID of the checklist.
 * @param title The new title of the checklist.
 * @param locked Whether the checklist is locked.
 * @param token The user's access token.
 * @returns The updated checklist.
 * @throws Error if the request fails.
 * @example
 * ```typescript
 * const checklist = await updateChecklist("123", "New Title", true, false)
 * ```
 */
async function updateChecklist(
  checklistID: string,
  title: string,
  locked: boolean,
  token: string | null,
) {
  const path = `/checklists/${checklistID}`
  const res = await fetch(`${process.env.BASE_URL}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, locked }),
  })

  const body = await res.json()
  if (!res.ok) {
    Honeybadger.notify(new Error(`Failed to update checklist: ${body.message}`))
    throw new Error(`Failed to update checklist: ${res.status}`)
  }
  return body
}

/**
 * Deletes a checklist.
 * @param checklistID The ID of the checklist.
 * @param token The user's access token.
 * @returns The deleted checklist.
 * @throws Error if the request fails.
 * @example
 * ```typescript
 * const checklist = await deleteChecklist("123")
 * ```
 */
async function deleteChecklist(checklistID: string, token: string | null) {
  const res = await fetch(`${process.env.BASE_URL}/checklists/${checklistID}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  const body = await res.json()
  if (!res.ok) {
    Honeybadger.notify(new Error(`Failed to delete checklist: ${body.message}`))
    throw new Error(`Failed to delete checklist: ${res.status}`)
  }

  return body
}

/**
 * Removes a user from a shared checklist.
 * @param checklistID The ID of the checklist.
 * @returns A message indicating success.
 * @throws Error if the request fails.
 * @example
 * ```typescript
 * const message = await leaveSharedChecklist("123")
 * ```
 */
async function leaveSharedChecklist(checklistID: string, token: string | null) {
  const res = await fetch(
    `${process.env.BASE_URL}/checklists/${checklistID}/share`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  )

  const body = await res.json()
  if (!res.ok) {
    Honeybadger.notify(new Error(`Failed to leave checklist: ${body.message}`))
    throw new Error(`Failed to leave checklist: ${res.status}`)
  }
  return body
}

/**
 * Fetches a share code for a checklist.
 * @param checklistID The ID of the checklist.
 * @returns The share code.
 * @throws Error if the request fails.
 * @example
 * ```typescript
 * const shareCode = await getChecklistShareCode("123")
 * ```
 */
async function getChecklistShareCode(
  checklistID: string,
  token: string | null,
) {
  const res = await fetch(
    `${process.env.BASE_URL}/checklists/${checklistID}/share`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  )

  const body = await res.json()
  if (!res.ok) {
    Honeybadger.notify(new Error(`Failed to get share code: ${body.message}`))
    throw new Error(`Failed to get share link: ${res.status}`)
  }

  return body
}

/**
 * Calls the API to add the current user to a shared checklist.
 * @param shortCode The short code of the shared checklist.
 * @returns A message indicating success.
 * @throws Error if the request fails.
 * @example
 * ```typescript
 * const checklist = await addUserToSharedList("abc123")
 * ```
 */
async function addUserToSharedList(shortCode: string, token: string | null) {
  const res = await fetch(
    `${process.env.BASE_URL}/checklists/share/${shortCode}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  )

  const body = await res.json()
  if (!res.ok) {
    Honeybadger.notify(
      new Error(`Failed to add user to shared list: ${body.message}`),
    )
    throw new Error(`Failed to add user to shared list: ${res.status}`)
  }

  return body
}

/**
 * Creates a new item in a checklist.
 * @param checklistID The ID of the checklist.
 * @param content The content of the item.
 * @param ordering The order of the item.
 * @returns The new item.
 * @throws Error if the request fails.
 * @example
 * ```typescript
 * const item = await createItem("123", "New Item", 0)
 * ```
 */
async function createItem(
  checklistID: string,
  content: string,
  ordering: number,
  token: string | null,
) {
  const path = `/checklists/${checklistID}/items`
  const res = await fetch(`${process.env.BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content, ordering }),
  })

  const body = await res.json()
  if (!res.ok) {
    Honeybadger.notify(new Error(`Failed to create item: ${body.message}`))
    throw new Error(`Failed to create item: ${res.status}`)
  }
  return body
}

/**
 * Updates an item in a checklist.
 * @param checklistID The ID of the checklist.
 * @param itemID The ID of the item to update.
 * @param checked Whether the item is checked.
 * @param content The content of the item.
 * @param ordering The order of the item.
 * @returns A message indicating success.
 * @throws Error if the request fails.
 * @example
 * ```typescript
 * const item = await updateItem("123", "456", true, "New Content", 0, false)
 * ```
 */
async function updateItem(
  checklistID: string,
  itemID: string,
  checked: boolean,
  content: string,
  ordering: number,
  token: string | null,
) {
  const path = `/checklists/${checklistID}/items/${itemID}`
  const res = await fetch(`${process.env.BASE_URL}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content, checked, ordering }),
  })

  const body = await res.json()
  if (!res.ok) {
    Honeybadger.notify(new Error(`Failed to update item: ${body.message}`))
    throw new Error(`Failed to update item: ${res.status}`)
  }
  return body
}

/**
 * Deletes an item from a checklist.
 * @param checklistID The ID of the checklist.
 * @param itemID The ID of the item to delete.
 * @returns A message indicating success.
 * @throws Error if the request fails.
 * @example
 * ```typescript
 * const checklist = await deleteItem("123", "456")
 * ```
 */
async function deleteItem(
  checklistID: string,
  itemID: string,
  token: string | null,
) {
  const path = `/checklists/${checklistID}/items/${itemID}`
  const res = await fetch(`${process.env.BASE_URL}${path}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  const body = await res.json()
  if (!res.ok) {
    Honeybadger.notify(new Error(`Failed to delete item: ${body.message}`))
    throw new Error(`Failed to delete item: ${res.status}`)
  }
  return body
}

export {
  getChecklists,
  getChecklist,
  createChecklist,
  updateChecklist,
  deleteChecklist,
  leaveSharedChecklist,
  getChecklistShareCode,
  addUserToSharedList,
  createItem,
  updateItem,
  deleteItem,
}
