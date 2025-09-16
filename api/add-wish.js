// File: /api/add-wish.js

// Cần cài đặt mongodb: npm install mongodb
const { MongoClient } = require('mongodb');

// Chuỗi kết nối sẽ được lấy từ biến môi trường trên Vercel
const mongoURI = process.env.MONGODB_URI;
const dbName = 'wedding_wishes'; // Tên cơ sở dữ liệu của bạn
const collectionName = 'wishes'; // Tên bộ sưu tập (bảng) của bạn

// Cấu hình để Vercel biết không phân tích cú pháp body
export const config = {
    api: {
        bodyParser: true,
    },
};

// Hàm xử lý chính
export default async function handler(req, res) {
    // Chỉ cho phép phương thức POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const data = req.body; // Vercel tự động parse body cho bạn

        if (!data.name || !data.message) {
            return res.status(400).json({ message: 'Tên và lời chúc là bắt buộc.' });
        }

        const client = new MongoClient(mongoURI);
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        await collection.insertOne({
            name: data.name,
            message: data.message,
            createdAt: new Date(),
        });

        await client.close();

        return res.status(200).json({ message: 'Lời chúc đã được gửi thành công!' });

    } catch (error) {
        console.error('Lỗi khi lưu lời chúc:', error);
        return res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
    }
}