import path from "path";
import dotenv from "dotenv";
import { writeFileSync } from "fs";
import { OpenAI } from "openai";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const results = [
  ["8sd9dgg98", "8sd9deeegg98", "11-0, 11-0"],
  [
    "14b726fc-a953-47aa-807e-3955f233cd81",
    "0cd2a46c-d388-44d6-9427-0d5429dcb720",
    "11-9, 8-11, 11-9",
  ],
  [
    "0721a11f-8001-4a07-8ea0-27c8539e2b04",
    "992aef8e-b37a-480a-9c30-aa502e2bd3db",
    "11-0, 11-0",
  ],
];

const stringify = JSON.stringify(results);

console.log("logged: stringify", stringify);

const getNewMatches = async () => {
  const prompt = `
I have a sportsladder that manages pickleball matches. the first round players were assigned at random, of which I will give you the match results. also, the first 2 arr elements
are players id's in each array. please generate a new array of matches in such a way that players get opponents as close to their level as possible. dont make up new user id's. 
please just use the ones that are given here (1st and 2nd element in each inner arr):
${stringify}
pls return json object with 2 keys: a new 2d array with matches on key "matches". 1 element in that array could look like:
  ["USER_ID1", "USER_ID2"],
 and  a key "explanation"
that explains why you assigned players in the way that you did.
`;

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "gpt-4-turbo",
      temperature: 0.1,

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

const test = async () => {
  const matches = await getNewMatches();

  console.log("logged: matches", matches);
};
test();
