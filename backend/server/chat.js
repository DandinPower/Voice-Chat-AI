require('dotenv').config()
const {GetBasePrompt, AddChat, GetQuestions, GetResponse, GetChatLength} = require('../prompt')
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

const ClearResponseNewLine = (text) => {
    let arr = text.split(/\n/)
    let lastSegment = arr.pop()
    return lastSegment
}

async function GetGPTResponse(socketId, question){
    let basePrompt = await GetBasePrompt(socketId)
    let previousLength = await GetChatLength(socketId)
    let questions = await GetQuestions(socketId)
    let responses = await GetResponse(socketId)
    var prompt = basePrompt
    for (let i=0; i<previousLength; i++){
      prompt = `${prompt}\nMy question: ${questions[i]}`
      prompt = `${prompt}\nAshley's reply: ${responses[i]}`
    }
    prompt = `${prompt}\nNow answer my new question: ${question}`
    prompt = `${prompt}\nAshley's reply:`

    console.log(`Prompt:\n ${prompt}`)

    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 256,
      });
    let response = ClearResponseNewLine(completion.data.choices[0].text)

    await AddChat(socketId, question, response)

    console.log(`Response:\n ${response}`)
    return response
}

module.exports = { GetGPTResponse }