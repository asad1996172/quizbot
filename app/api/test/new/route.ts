import { connectToDatabase } from "@utils/database";
import Test from "@models/test";

export const POST = async (req: Request, res: Response) => {
    const { userId, prompt, tag, title } = await req.json();

    try {
        await connectToDatabase();
        const newTest = new Test({
            creator: userId,
            prompt,
            tag,
            title,
        });
        await newTest.save();

        return new Response(JSON.stringify(newTest), { status: 201 });
    } catch (error) {
        return new Response("Failed to create a new test !!", { status: 500 });
    }
}