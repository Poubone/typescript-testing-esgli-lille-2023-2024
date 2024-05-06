export async function sendGetRequest(url: string) {
  try {
    const response = await fetch('http://localhost:3000/api' + url); 
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.status}`);
    } 
    return response.json()
  
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

export async function sendPostRequest(url: string, data : Object) {
  try {
    const response = await fetch('http://localhost:3000/api' + url, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify(data),
    }); 
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.status}`);
    } 
    return response.json()
  
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

export async function sendDeleteRequest(url: string) {
  try {
    const response = await fetch('http://localhost:3000/api' + url, {
      method: 'DELETE', 
    }); 
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.status}`);
    } 
    return response.json()
  
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}