export const fetchMessages = async (user_id: number, conversation_id: number) => {
  try {
    const url = `http://localhost:8000/messages/${user_id}/${conversation_id}`;

    // Makes a get request to fetch user messages based on conversation
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
    // list of all messages
    return userInfoJson;
  } catch (error) {
    // Catches a fetch error
    throw new Error(`Failed to fetch user info: ${error}`);
  }
};
