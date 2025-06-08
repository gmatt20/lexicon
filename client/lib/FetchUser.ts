export const fetchUserInfo = async () => {
  try {
    const url = "http://localhost:8000/auth/me/";

    // Makes a get request to fetch user information
    const response = await fetch(url, {
      method: "GET",
      // Includes the cookies
      credentials: "include",
    });

    // Throws a HTTP error
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    // Parses into JSON
    const userInfoJson = await response.json();

    // Returns a JSON:
    // id: number
    // username: string
    // is_guest: bool
    return userInfoJson;
  } catch (error) {
    // Catches a fetch error
    throw new Error(`Failed to fetch user info: ${error}`)
  }
};
