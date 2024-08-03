"use server"

import { getAuth0Token } from "./sessionUtils"

/**
 * Fetches all checklists for the current user.
 * @returns An array of checklists.
 * @throws Error if the request fails.
 * @example
 * ```typescript
 * const checklists = await getChecklists()
 * ```
 */
async function getChecklists() {
  const token = await getAuth0Token()
  const res = await fetch(`${process.env.BASE_URL}/checklists`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error(`Failed to get checklists: ${res.status}`)
  }
  return await res.json()
}

/**
 * Fetches all shared checklists for the current user.
 * @returns An array of shared checklists.
 * @throws Error if the request fails.
 * @example
 * ```typescript
 * const sharedChecklists = await getSharedChecklists()
 * ```
 */
async function getSharedChecklists() {
  const token = await getAuth0Token()
  const res = await fetch(`${process.env.BASE_URL}/checklists/shared`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error(`Failed to get shared checklists: ${res.status}`)
  }
  return await res.json()
}

/**
 * Fetches a checklist by ID.
 * @param checklistID The ID of the checklist.
 * @param shared Whether the checklist is a shared checklist.
 * @returns The checklist.
 * @throws Error if the request fails.
 * @example
 * ```typescript
 * const checklist = await getChecklist("123")
 * ```
 */
async function getChecklist(checklistID: string, shared = false) {
  const token = await getAuth0Token()
  const path = shared
    ? `/checklist/${checklistID}/shared`
    : `/checklist/${checklistID}`
  const res = await fetch(`${process.env.BASE_URL}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error(`Failed to get checklist: ${res.status}`)
  }
  return await res.json()
}

/**
 * Creates a new checklist.
 * @returns The new checklist.
 * @throws Error if the request fails.
 * @example
 * ```typescript
 * const checklist = await createChecklist()
 * ```
 */
async function createChecklist() {
  const token = await getAuth0Token()
  const res = await fetch(`${process.env.BASE_URL}/checklist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title: "New Listo (click to edit)" }),
  })

  if (!res.ok) {
    throw new Error(`Failed to create checklist: ${res.status}`)
  }

  return await res.json()
}

/**
 * Updates a checklist.
 * @param checklistID The ID of the checklist.
 * @param title The new title of the checklist.
 * @param locked Whether the checklist is locked.
 * @param shared Whether the checklist is a shared checklist.
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
  shared: boolean = false,
) {
  const token = await getAuth0Token()
  const path = shared
    ? `/checklist/${checklistID}/shared`
    : `/checklist/${checklistID}`
  const res = await fetch(`${process.env.BASE_URL}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, locked }),
  })

  if (!res.ok) {
    throw new Error(`Failed to update checklist: ${res.status}`)
  }

  return await res.json()
}

/**
 * Deletes a checklist.
 * @param checklistID The ID of the checklist.
 * @returns The deleted checklist.
 * @throws Error if the request fails.
 * @example
 * ```typescript
 * const checklist = await deleteChecklist("123")
 * ```
 */
async function deleteChecklist(checklistID: string) {
  const token = await getAuth0Token()
  const res = await fetch(`${process.env.BASE_URL}/checklist/${checklistID}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error(`Failed to delete checklist: ${res.status}`)
  }

  return await res.json()
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
async function getChecklistShareCode(checklistID: string) {
  const token = await getAuth0Token()
  const res = await fetch(
    `${process.env.BASE_URL}/checklist/${checklistID}/share`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!res.ok) {
    throw new Error(`Failed to get share link: ${res.status}`)
  }

  return await res.json()
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
async function addUserToSharedList(shortCode: string) {
  const token = await getAuth0Token()
  const res = await fetch(
    `${process.env.BASE_URL}/checklist/share/${shortCode}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!res.ok) {
    throw new Error(`Failed to add user to shared list: ${res.status}`)
  }

  return await res.json()
}

/**
 * Creates a new item in a checklist.
 * @param checklistID The ID of the checklist.
 * @param content The content of the item.
 * @param ordering The order of the item.
 * @param shared Whether the checklist is a shared checklist.
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
  shared: boolean = false,
) {
  const token = await getAuth0Token()
  const path = shared
    ? `/checklist/${checklistID}/shared/item`
    : `/checklist/${checklistID}/item`
  const res = await fetch(`${process.env.BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content, ordering }),
  })

  if (!res.ok) {
    throw new Error(`Failed to create item: ${res.status}`)
  }
  return await res.json()
}

/**
 * Updates an item in a checklist.
 * @param checklistID The ID of the checklist.
 * @param itemID The ID of the item to update.
 * @param checked Whether the item is checked.
 * @param content The content of the item.
 * @param ordering The order of the item.
 * @param shared Whether the checklist is a shared checklist.
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
  shared: boolean = false,
) {
  const token = await getAuth0Token()
  const path = shared
    ? `/checklist/${checklistID}/shared/item/${itemID}`
    : `/checklist/${checklistID}/item/${itemID}`
  const res = await fetch(`${process.env.BASE_URL}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content, checked, ordering }),
  })

  if (!res.ok) {
    throw new Error(`Failed to update item: ${res.status}`)
  }
  return await res.json()
}

/**
 * Toggles all items in a checklist.
 * @param checklistID The ID of the checklist.
 * @param checked Whether the items should be checked.
 * @param shared Whether the checklist is a shared checklist.
 * @returns A message indicating success.
 * @throws Error if the request fails.
 * @example
 * ```typescript
 * const checklist = await toggleAllItems("123", true)
 * ```
 */
async function toggleAllItems(
  checklistID: string,
  checked: boolean,
  shared: boolean = false,
) {
  const token = await getAuth0Token()
  const path = shared
    ? `/checklist/${checklistID}/shared/items`
    : `/checklist/${checklistID}/items`
  const res = await fetch(`${process.env.BASE_URL}${path}?checked=${checked}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error(`Failed to toggle all items: ${res.status}`)
  }

  return await res.json()
}

/**
 * Deletes an item from a checklist.
 * @param checklistID The ID of the checklist.
 * @param itemID The ID of the item to delete.
 * @param shared Whether the checklist is is a shared checklist.
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
  shared: boolean = false,
) {
  const token = await getAuth0Token()
  const path = shared
    ? `/checklist/${checklistID}/shared/item/${itemID}`
    : `/checklist/${checklistID}/item/${itemID}`
  const res = await fetch(`${process.env.BASE_URL}${path}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error(`Failed to delete item: ${res.status}`)
  }

  return await res.json()
}

export {
  getChecklists,
  getSharedChecklists,
  getChecklist,
  createChecklist,
  updateChecklist,
  deleteChecklist,
  getChecklistShareCode,
  addUserToSharedList,
  createItem,
  updateItem,
  toggleAllItems,
  deleteItem,
}
