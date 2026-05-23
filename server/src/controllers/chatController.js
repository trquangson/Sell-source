const chatService = require('../services/chatService');

exports.handleChat = async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: 'Message is required' });
        }

        const responseText = await chatService.generateChatResponse(message, history || []);

        return res.status(200).json({
            success: true,
            data: responseText
        });
    } catch (error) {
        console.error('Chat Controller Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi xử lý chat. Vui lòng thử lại sau.'
        });
    }
};
