import Test from "@models/test";
import { connectToDatabase } from "@utils/database";

export const GET = async (request: Request, { params }) => {
    try {
        await connectToDatabase()

        const test = await Test.findById(params.id).populate("creator")
        if (!test) return new Response("Test Not Found", { status: 404 });

        return new Response(JSON.stringify(test), { status: 200 })

    } catch (error) {
        return new Response("Internal Server Error", { status: 500 });
    }
}

export const PATCH = async (request: Request, { params }) => {
    const { prompt, tag, title } = await request.json();

    try {
        await connectToDatabase();

        const existingTest = await Test.findById(params.id);

        if (!existingTest) {
            return new Response("Test not found", { status: 404 });
        }

        existingTest.prompt = prompt;
        existingTest.tag = tag;
        existingTest.title = title;

        await existingTest.save();

        return new Response("Successfully updated the test", { status: 200 });
    } catch (error) {
        return new Response("Error Updating test", { status: 500 });
    }
};

export const DELETE = async (request: Request, { params }) => {
    try {
        await connectToDatabase();

        await Test.findByIdAndRemove(params.id);

        return new Response("Test deleted successfully", { status: 200 });
    } catch (error) {
        return new Response("Error deleting test", { status: 500 });
    }
};