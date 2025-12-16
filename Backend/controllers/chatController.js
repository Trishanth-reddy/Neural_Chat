import Chat from '../models/chatModel.js';
import fetch from 'node-fetch'; 

/**
 * @description Handles the entire chat process: saves user message, streams AI response, saves AI response.
 * @route POST /api/chats/stream
 */
export const streamChatCompletion = async (req, res) => {
    let { userId, message, fullPrompt, chatId } = req.body;

    // Sanitize the userId to remove any leading/trailing whitespace.
    if (userId && typeof userId === 'string') {
        userId = userId.trim();
    }

    if (!userId || !message || !fullPrompt) {
        return res.status(400).json({ message: 'Missing required fields: userId, message, and fullPrompt are required.' });
    }

    try {
        let currentChat;

        // Step 1: Save the user's message to the database.
        if (chatId) {
            currentChat = await Chat.findByIdAndUpdate(
                chatId,
                { $push: { messages: message } },
                { new: true }
            );
        } else {
            // Create a title from the first 30 chars of the message
            const title = message.content ? message.content.substring(0, 30) : "New Chat";
            currentChat = await Chat.create({
                userId,
                title,
                messages: [message],
            });
        }

        if (!currentChat) {
            return res.status(404).json({ message: 'Chat could not be found or created.' });
        }

        // Step 2: Securely call the Mistral AI API
        const mistralResponse = await fetch("https://api.mistral.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`,
            },
            body: JSON.stringify({
                // FIXED: Used the free-tier friendly model
                model: "open-mistral-7b", 
                messages: [{ role: "user", content: fullPrompt }],
                stream: false,
            }),
        });

        // SAFETY CHECK: If API fails (e.g., 429 Limit Exceeded), throw error so we don't crash later
        if (!mistralResponse.ok) {
            const errorBody = await mistralResponse.text();
            throw new Error(`Mistral API error: ${mistralResponse.status} ${errorBody}`);
        }

        // Step 3: Parse the JSON response from the AI.
        const aiResponseData = await mistralResponse.json();
        
        // FIXED: safely get content. If it's missing/null, use empty string.
        const rawContent = aiResponseData.choices?.[0]?.message?.content;
        const fullAIResponseContent = rawContent ? String(rawContent) : "";

        let finalChat;
        
        // Step 4: Save the complete AI response to the database.
        if (fullAIResponseContent) {
            finalChat = await Chat.findByIdAndUpdate(currentChat._id, {
                // FIXED: We now know fullAIResponseContent is definitely a string, so .trim() works
                $push: { messages: { role: 'assistant', content: fullAIResponseContent.trim() } }
            }, { new: true });
        } else {
            finalChat = currentChat;
        }
        
        // Step 5: Send the final, updated chat object back to the frontend.
        res.status(200).json(finalChat);

    } catch (error) {
        console.error("Error in chatCompletion:", error);
        // Ensure we don't try to send a response twice
        if (!res.headersSent) {
            res.status(500).json({ message: `Server Error: ${error.message}` });
        }
    }
};

/**
 * @description Get a single chat by its ID, including all messages.
 * @route GET /api/chats/:chatId
 */
export const getChatById = async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.chatId);
        if (!chat) return res.status(404).json({ message: 'Chat not found' });
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};