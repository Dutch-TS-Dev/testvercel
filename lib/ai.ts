import path from "path";
import dotenv from "dotenv";
import { writeFileSync } from "fs";
import { OpenAI } from "openai";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

export const getGPTContactURLs = async (
  content: string
): Promise<{ most_likely_email_url: string } | undefined> => {
  try {
    // const apiKey = process.env.OPENAI_API_KEY;
    // const response = await fetch("https://api.openai.com/v1/chat/completions", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${apiKey}`,
    //   },
    //   body: JSON.stringify({
    //     model: "gpt-4",
    //     messages: [
    //       { role: "system", content: "You are a website analyst." },
    //       {
    //         role: "user",
    //         content: `Here is a list of URLs of a website: ${content}. Give me back the most likely URL to hold an email address. Respond in JSON format.`,
    //       },
    //       response_format: { type: 'json_object' }

    //     ],
    //   }),
    // });

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `test, can you answer? json`,
        },
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.1,
      // Assuming response_format needs to be an object with 'type' key based on your original code

      //
      response_format: { type: "json_object" },
    });
    console.log(
      "logged: JSON.parse(completion.choices?.[0].message?.content!",
      JSON.parse(completion.choices?.[0].message?.content!)
    );
    return JSON.parse(completion.choices?.[0].message?.content!);
  } catch (error) {
    console.error("Error fetching AI analysis:", error);
    return undefined;
  }
};
