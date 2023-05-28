const axios = require('axios');

const sendMessage = async (userMessage) => {
  const openaiEndpoint = 'https://api.openai.com/v1/chat/completions';
  const openaiApiKey = process.env.OPENAI_API_KEY;
  const model = 'davinci';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${openaiApiKey}`
  };
  const data = {
    'model': model,
    'prompt': { 'text': userMessage },
    'temperature': 0.5,
    'max_tokens': 4000,
    'top_p': 1,
    'frequency_penalty': 0,
    'presence_penalty': 0,
  };
  
  try {
    const response = await axios.post(openaiEndpoint, data, { headers });
    const chatResponse = response.data.choices[0].text;
    console.log(chatResponse);
    return chatResponse;
  } catch (error) {
    console.error(error);
  }
};

export default sendMessage;

