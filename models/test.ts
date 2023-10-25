import { Schema, model, models } from "mongoose";

const TestSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    prompt: {
        type: String,
        required: [true, "Prompt is required"],
    },
    tag: {
        type: String,
        required: [true, "Tag is required"],
    },
    title: {
        type: String,
        required: [true, "Title is required"],
    },
});

const Test = models.Test || model("Test", TestSchema);

export default Test;