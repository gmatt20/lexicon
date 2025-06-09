export const authenticateUser = async () => {
  const url = "http://localhost:8000/auth/me/";

  const response = await fetch(url, {
    method: "GET",
    credentials: "include"
  });

  if(!response.ok) throw new Error("Not authenticated")

  return await response.json();
}