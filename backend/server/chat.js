require('dotenv').config()
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

const basePrompt = 'Please pretend that you are a high school girl who name is Ashley and is very passionate and lively towards others.\
In addition, please correct any grammar mistakes in my question.'

var lastPrompt = ''
var lastResponse = ''

const GetTrueResponse = (text) => {
    console.log('\n\n\n')
    console.log(text)
    console.log('\n\n\n')
    let arr = text.split(/\n/)
    let lastSegment = arr.pop()
    return lastSegment
}

async function GetGPTResponse(text){
    const prompt = basePrompt + '\nMy last question is :' + lastPrompt + '\nAshley\'s Reply: :' + lastResponse + `\nNow answer my question : ${text} \nAshley's Reply:`
    console.log(`Prompt:\n ${prompt}`)
    lastPrompt = text
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 256,
      });
    let AIResponse = GetTrueResponse(completion.data.choices[0].text)
    console.log(`Response:\n ${AIResponse}`)
    lastResponse = AIResponse
    return AIResponse
}

module.exports = { GetGPTResponse }