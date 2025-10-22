import Chat from '../models/chatModel.js';
import fetch from 'node-fetch'; // Ensure you have node-fetch installed: npm i node-fetch

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
            const title = message.content.substring(0, 30);
            currentChat = await Chat.create({
                userId,
                title,
                messages: [message],
            });
        }

        if (!currentChat) {
            return res.status(404).json({ message: 'Chat could not be found or created.' });
        }

        // Step 2: Securely call the Mistral AI API for a complete response.
        const mistralResponse = await fetch("https://api.mistral.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`,
            },
            body: JSON.stringify({
                model: "mistral-small-latest",
                messages: [{ role: "user", content: fullPrompt }],
                // IMPORTANT: stream is now false.
                stream: false,
            }),
        });

        if (!mistralResponse.ok) {
            const errorBody = await mistralResponse.text();
            throw new Error(`Mistral API error: ${mistralResponse.status} ${errorBody}`);
        }

        // Step 3: Parse the single JSON response from the AI.
        const aiResponseData = await mistralResponse.json();
        const fullAIResponseContent = aiResponseData.choices[0]?.message?.content || "";

        let finalChat;
        // Step 4: Save the complete AI response to the database.
        if (fullAIResponseContent) {
            finalChat = await Chat.findByIdAndUpdate(currentChat._id, {
                $push: { messages: { role: 'assistant', content: fullAIResponseContent.trim() } }
            }, { new: true }); // Use {new: true} to get the fully updated document
        } else {
            // If the AI returns no content, just return the chat as is.
            finalChat = currentChat;
        }
        
        // Step 5: Send the final, updated chat object back to the frontend.
        res.status(200).json(finalChat);

    } catch (error) {
        console.error("Error in chatCompletion:", error);
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