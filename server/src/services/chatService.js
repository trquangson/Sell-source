const { GoogleGenAI } = require('@google/genai');
const SourceCode = require('../models/SourceCode');
const Setting = require('../models/Setting');

class ChatService {
    constructor() {
        if (!process.env.GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY is not defined in the environment variables.');
        }
        this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }

    async generateChatResponse(userMessage, history = []) {
        try {
            // Lấy dữ liệu website cơ bản
            const settings = await Setting.find({});
            const siteConfig = {};
            settings.forEach(setting => {
                siteConfig[setting.key] = setting.value;
            });

            // Lấy 20 sản phẩm gần đây làm ngữ cảnh
            const products = await SourceCode.find({ status: 'active' })
                .select('title description price category')
                .limit(20)
                .lean();

            const productsContext = products.map(p =>
                `- ${p.title} (${p.category}): ${p.price} VNĐ. Mô tả: ${p.description.substring(0, 100)}...`
            ).join('\n');

            const systemInstruction = `
Bạn là nhân viên hỗ trợ khách hàng ảo (AI) của website bán mã nguồn (source code) ${siteConfig['site.name'] || 'của chúng tôi'}.
Nhiệm vụ của bạn là hỗ trợ khách hàng tìm kiếm sản phẩm, giải đáp thắc mắc về mã nguồn, dịch vụ và chính sách của website.
Tuyệt đối KHÔNG trả lời các câu hỏi không liên quan đến website, sản phẩm, lập trình hoặc dịch vụ của chúng tôi. Nếu người dùng hỏi các chủ đề ngoài lề (như chính trị, thời tiết, giải trí chung chung, v.v.), hãy lịch sự từ chối và hướng họ quay lại chủ đề sản phẩm.

Dưới đây là một số thông tin sản phẩm nổi bật hiện có:
${productsContext}

Thông tin liên hệ của website:
Email: ${siteConfig['site.email'] || 'N/A'}
Số điện thoại: ${siteConfig['site.phone'] || 'N/A'}

Hãy trả lời ngắn gọn, thân thiện, dễ hiểu và chuyên nghiệp. Nếu người dùng hỏi mua, hãy hướng dẫn họ thêm vào giỏ hàng hoặc liên hệ trực tiếp.
            `;

            // Chuyển đổi lịch sử sang định dạng của Gemini API
            const contents = history.map(msg => ({
                role: msg.role === 'ai' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            }));

            // Thêm tin nhắn hiện tại của người dùng
            contents.push({
                role: 'user',
                parts: [{ text: userMessage }]
            });

            const response = await this.ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: contents,
                config: {
                    systemInstruction: systemInstruction,
                    temperature: 0.7,
                }
            });

            return response.text;
        } catch (error) {
            console.error('Lỗi khi gọi Gemini API:', error);
            throw new Error('Không thể tạo phản hồi từ AI lúc này.');
        }
    }
}

module.exports = new ChatService();
