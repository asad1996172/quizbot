import { connectToDatabase } from "@utils/database";
import Test from "@models/test";

export const GET = async (req, res) => {
    try {
        await connectToDatabase();
        const tests = await Test.find({}).populate("creator");

        return new Response(JSON.stringify(tests), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response("Failed to fetch tests", { status: 500 });
    }
}