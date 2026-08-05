import axios from "axios"
import appError from "../utils/appError.js"

export const askai = async (model, message) => {
    if (!message || message.length === 0 || !Array.isArray(message)) {
        throw new appError("no message found", 400)
    }

    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
        model,
        messages: message
    }, {
        headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json'
        }
    })

    const content = response?.data?.choices?.[0]?.message?.content

    if (!content) {
        throw new appError("AI message not found", 500)
    }

    return content
}