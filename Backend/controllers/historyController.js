import Chat from '../models/chatModel.js';

export const getUserHistoryDetails = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find all chats for the given user, sorted by the most recently updated.
        const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });

        if (!chats) {
            return res.status(200).json([]); // Return empty array if no history
        }

        // Transform the chat data into the format expected by the frontend History component.
        const formattedHistory = chats.map(chat => {
            // Find the first user message to use as the 'input'.
            const firstUserMessage = chat.messages.find(m => m.role === 'user');
            // Find the first assistant message to use as the 'fulltext' preview.
            const firstAssistantMessage = chat.messages.find(m => m.role === 'assistant');

            return {
                id: chat._id,
                input: firstUserMessage ? firstUserMessage.content : "Chat started...",
                fulltext: firstAssistantMessage ? firstAssistantMessage.content : "No response yet.",
                date: new Date(chat.updatedAt).toLocaleDateString(),
                chatlink: `/chat/${chat._id}`
            };
        });

        res.status(200).json(formattedHistory);

    } catch (error) {
        console.error("Error fetching user history details:", error);
        res.status(500).json({ message: "Server error while fetching history." });
    }
};
