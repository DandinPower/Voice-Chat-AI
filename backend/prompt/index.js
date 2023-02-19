require('dotenv').config()
const redisClient = require('../redis')

const CHAT_RECORD_LENGTH = process.env.CHAT_RECORD_LENGTH

async function SetBasePrompt(socketId, type) {
    if (type == 'en-US-AshleyNeural') {
        const basePrompt = 'Please pretend that you are a high school girl who name is Ashley and is very passionate and lively towards others.In addition, in your reply please correct any grammar mistakes in my question.'
        await redisClient.hSet(socketId, 'base_prompt', basePrompt)
    }
}

async function GetBasePrompt(socketId) {
    return redisClient.hGet(socketId, 'base_prompt')
}

async function AddChat(socketId, question, response) {
    const questions = `${socketId}_questions`
    const responses = `${socketId}_responses`
    await redisClient.rPush(questions, question)
    await redisClient.rPush(responses, response)
    let length = await redisClient.lLen(questions)
    if (length > CHAT_RECORD_LENGTH) {
        await redisClient.lPop(questions)
        await redisClient.lPop(responses)
    }
}

async function GetQuestions(socketId) {
    const questions = `${socketId}_questions`
    let result = await redisClient.lRange(questions, 0, -1)
    return result
}

async function GetResponse(socketId) {
    const responses = `${socketId}_responses`
    let result = await redisClient.lRange(responses, 0, -1)
    return result
}

async function GetChatLength(socketId) {
    const questions = `${socketId}_questions`
    return await redisClient.lLen(questions)
}

async function ClearSocketInfo(socketId) {
    const questions = `${socketId}_questions`
    const responses = `${socketId}_responses`
    await redisClient.del(questions)
    await redisClient.del(responses)
    await redisClient.hDel(socketId, 'base_prompt')
}

module.exports = {SetBasePrompt, GetBasePrompt, AddChat, GetQuestions, GetResponse, GetChatLength, ClearSocketInfo}