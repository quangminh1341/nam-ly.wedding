import { MongoClient } from 'mongodb';

// Chuỗi kết nối sẽ được lấy từ biến môi trường trên Vercel
const mongoURI = process.env.MONGODB_URI;
const dbName = 'wedding_wishes';
const collectionName = 'wishes';

// Hàm xử lý chính
export default async function handler(req, res) {
    // Chỉ cho phép phương thức GET
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const client = new MongoClient(mongoURI);
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Lấy tất cả lời chúc, sắp xếp từ mới nhất đến cũ nhất
        const wishes = await collection.find({}).sort({ createdAt: -1 }).toArray();

        await client.close();

        return res.status(200).json(wishes);

    } catch (error) {
        console.error('Lỗi khi lấy danh sách lời chúc:', error);
        return res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
    }
}