import { connectToDatabase } from "@utils/database";
import Test from "@models/test";

export const GET = async (req: Request, { params }) => {
    try {
        await connectToDatabase();
        const tests = await Test.find({
            creator: params.id
        }).populate("creator");

        return new Response(JSON.stringify(tests), { status: 200 });
    } catch (error) {
        return new Response("Failed to fetch user tests", { status: 500 });
    }
}