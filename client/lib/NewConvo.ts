export const NewConvo = async (title: string) => {
  try {
    const url = "http://localhost:8000/conversation/";

    // Makes a get request to fetch user messages based on conversation
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Includes the cookies
      credentials: "include",
      body: JSON.stringify({ title }),
    });

    // Throws a HTTP error
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
  } catch (error) {
    // Catches a fetch error
    throw new Error(`Failed to make a new conversation: ${error}`);
  }
};
