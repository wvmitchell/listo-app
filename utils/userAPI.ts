import { BASE_URL, getAuth0Token, getUserID } from "./sessionUtils"

export async function userExists() {
  const userId = await getUserID()
  const token = await getAuth0Token()
  const response = await fetch(`${BASE_URL}/user/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      // TODO: stop passsing userID in headers, instead parse it out in the API from the token
      userID: userId,
    },
  })
  return response.ok
}

export async function createUserProfile() {
  const userId = await getUserID()
  const token = await getAuth0Token()
  const response = await fetch(`${BASE_URL}/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      // TODO: stop passsing userID in headers, instead parse it out in the API from the token
      userID: userId,
    },
  })
  return response.ok
}
