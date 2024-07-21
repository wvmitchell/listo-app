"use server"

// base url is the environment variable BASE_URL or http://localhost:3000
const BASE_URL = process.env.BASE_URL || "http://localhost:8080"
import { getSession } from "@auth0/nextjs-auth0"

async function getUserID(): Promise<string> {
  const session = await getSession()
  return session?.user.sub
}

async function getAuth0Token(): Promise<string | undefined> {
  const session = await getSession()
  return session?.accessToken
}

async function getChecklists() {
  const token = await getAuth0Token()
  const userID = await getUserID()
  const res = await fetch(`${BASE_URL}/checklists`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      // TODO: stop passsing userID in headers, instead parse it out in the API from the token
      userID,
    },
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error(`Failed to get checklists: ${res.status}`)
  }
  return await res.json()
}

async function getChecklist(id: string) {
  const token = await getAuth0Token()
  const userID = await getUserID()
  const res = await fetch(`${BASE_URL}/checklist/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      // TODO: stop passsing userID in headers, instead parse it out in the API from the token
      userID,
    },
  })

  if (!res.ok) {
    throw new Error(`Failed to get checklist: ${res.status}`)
  }
  return await res.json()
}

async function createChecklist() {
  const token = await getAuth0Token()
  const userID = await getUserID()
  const res = await fetch(`${BASE_URL}/checklist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      // TODO: stop passsing userID in headers, instead parse it out in the API from the token
      userID,
    },
    body: JSON.stringify({ title: "New Listo (click to edit)" }),
  })

  if (!res.ok) {
    throw new Error(`Failed to create checklist: ${res.status}`)
  }

  return await res.json()
}

async function updateChecklist(
  checklistID: string,
  title: string,
  locked: boolean,
) {
  const token = await getAuth0Token()
  const userID = await getUserID()
  const res = await fetch(`${BASE_URL}/checklist/${checklistID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      // TODO: stop passsing userID in headers, instead parse it out in the API from the token
      userID,
    },
    body: JSON.stringify({ title, locked }),
  })

  if (!res.ok) {
    throw new Error(`Failed to update checklist: ${res.status}`)
  }

  return await res.json()
}

async function deleteChecklist(checklistID: string) {
  const token = await getAuth0Token()
  const userID = await getUserID()
  const res = await fetch(`${BASE_URL}/checklist/${checklistID}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      // TODO: stop passsing userID in headers, instead parse it out in the API from the token
      userID,
    },
  })

  if (!res.ok) {
    throw new Error(`Failed to delete checklist: ${res.status}`)
  }

  return await res.json()
}

async function createItem(
  checklistID: string,
  content: string,
  ordering: number,
) {
  const token = await getAuth0Token()
  const userID = await getUserID()
  const res = await fetch(`${BASE_URL}/checklist/${checklistID}/item`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      // TODO: stop passsing userID in headers, instead parse it out in the API from the token
      userID,
    },
    body: JSON.stringify({ content, ordering }),
  })

  if (!res.ok) {
    throw new Error(`Failed to create item: ${res.status}`)
  }
  return await res.json()
}

async function updateItem(
  checklistID: string,
  itemID: string,
  checked: boolean,
  content: string,
  ordering: number,
) {
  const token = await getAuth0Token()
  const userID = await getUserID()
  const res = await fetch(
    `${BASE_URL}/checklist/${checklistID}/item/${itemID}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        // TODO: stop passsing userID in headers, instead parse it out in the API from the token
        userID,
      },
      body: JSON.stringify({ content, checked, ordering }),
    },
  )

  if (!res.ok) {
    throw new Error(`Failed to update item: ${res.status}`)
  }
  return await res.json()
}

async function toggleAllItems(checklistID: string, checked: boolean) {
  const token = await getAuth0Token()
  const userID = await getUserID()
  const res = await fetch(
    `${BASE_URL}/checklist/${checklistID}/items?checked=${checked}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        // TODO: stop passsing userID in headers, instead parse it out in the API from the token
        userID,
      },
    },
  )

  if (!res.ok) {
    throw new Error(`Failed to toggle all items: ${res.status}`)
  }

  return await res.json()
}

async function deleteItem(checklistID: string, itemID: string) {
  const token = await getAuth0Token()
  const userID = await getUserID()
  const res = await fetch(
    `${BASE_URL}/checklist/${checklistID}/item/${itemID}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        // TODO: stop passsing userID in headers, instead parse it out in the API from the token
        userID,
      },
    },
  )

  if (!res.ok) {
    throw new Error(`Failed to delete item: ${res.status}`)
  }

  return await res.json()
}

export {
  getChecklists,
  getChecklist,
  createChecklist,
  updateChecklist,
  deleteChecklist,
  createItem,
  updateItem,
  toggleAllItems,
  deleteItem,
}
