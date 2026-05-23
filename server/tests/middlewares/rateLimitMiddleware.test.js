const request = require('supertest');
const express = require('express');
const {
    globalLimiter,
    authLimiter,
    forgotPasswordLimiter,
    paymentLimiter,
    contentCreationLimiter
} = require('../../src/middlewares/rateLimitMiddleware');

describe('Rate Limit Middlewares', () => {
    let app;

    beforeEach(() => {
        app = express();
        
        // Cần cho express-rate-limit hoạt động khi app.set('trust proxy', 1) không có,
        // hoặc khi dùng supertest vì supertest fake request IP.
        // Để dễ test, ta sẽ giả lập một IP cố định cho tất cả requests.
        app.use((req, res, next) => {
            req.ip = '1.2.3.4';
            next();
        });
        
        // Mock routes for each limiter
        app.get('/global', globalLimiter, (req, res) => res.send('OK'));
        app.get('/auth', authLimiter, (req, res) => res.send('OK'));
        app.get('/forgot-password', forgotPasswordLimiter, (req, res) => res.send('OK'));
        app.get('/payment', paymentLimiter, (req, res) => res.send('OK'));
        app.get('/content', contentCreationLimiter, (req, res) => res.send('OK'));
    });

    test('globalLimiter nên chặn sau 400 request', async () => {
        for (let i = 0; i < 400; i++) {
            await request(app).get('/global');
        }
        
        const res = await request(app).get('/global');
        expect(res.status).toBe(429);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Hệ thống bận, vui lòng thử lại sau');
    }, 15000); 

    test('authLimiter nên chặn sau 5 request', async () => {
        for (let i = 0; i < 5; i++) {
            await request(app).get('/auth');
        }
        
        const res = await request(app).get('/auth');
        expect(res.status).toBe(429);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Thử quá nhiều lần, vui lòng đợi 5 phút');
    });

    test('forgotPasswordLimiter nên chặn sau 3 request', async () => {
        for (let i = 0; i < 3; i++) {
            await request(app).get('/forgot-password');
        }
        
        const res = await request(app).get('/forgot-password');
        expect(res.status).toBe(429);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Yêu cầu khôi phục mật khẩu quá nhiều lần, thử lại sau 1 tiếng');
    });

    test('paymentLimiter nên chặn sau 5 request', async () => {
        for (let i = 0; i < 5; i++) {
            await request(app).get('/payment');
        }
        
        const res = await request(app).get('/payment');
        expect(res.status).toBe(429);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Thao tác thanh toán quá nhanh, vui lòng đợi');
    });

    test('contentCreationLimiter nên chặn sau 10 request', async () => {
        for (let i = 0; i < 10; i++) {
            await request(app).get('/content');
        }
        
        const res = await request(app).get('/content');
        expect(res.status).toBe(429);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Thao tác quá nhanh, vui lòng chậm lại');
    });
});
