export const fetchPostHistory = async (postId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/posts/${postId}/history`, {
        method: 'GET',
        credentials: 'include', // Include credentials if needed
      });
  
      if (!response.ok) {
        throw new Error(`Error fetching post history: ${response.statusText}`);
      }
  
      const historyData = await response.json();
      console.log('Fetched post history:', historyData); // Debugging statement
      return historyData;
    } catch (error) {
      console.error('Error fetching post history:', error);
      throw error;
    }
  };