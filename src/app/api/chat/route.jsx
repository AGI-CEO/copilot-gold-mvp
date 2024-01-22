import dotenv from "dotenv";
import { ClarifaiStub, grpc } from "clarifai-nodejs-grpc";
import fs from "fs";

dotenv.config();

const PAT = process.env.PAT;
// Specify the correct user_id/app_id pairings
// Since you're making inferences outside your app's scope
const USER_ID = "openai";
const APP_ID = "chat-completion";
// Change these to whatever model and text URL you want to use
const MODEL_ID = "gpt-4-turbo";
const MODEL_VERSION_ID = "182136408b4b4002a920fd500839f2c8";
const RAW_TEXT = "I love your product very much";
// To use a hosted text file, assign the url variable
// const TEXT_URL = 'https://samples.clarifai.com/negative_sentence_12.txt';
// Or, to use a local text file, assign the url variable
// const TEXT_FILE_LOCATION = 'YOUR_TEXT_FILE_LOCATION_HERE';

///////////////////////////////////////////////////////////////////////////////////
// YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
///////////////////////////////////////////////////////////////////////////////////

const stub = ClarifaiStub.grpc();

// This will be used by every Clarifai endpoint call
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key " + PAT);

// To use a local text file, uncomment the following lines
// const fs = require("fs");
// const fileBytes = fs.readFileSync(TEXT_FILE_LOCATION);

stub.PostModelOutputs(
  {
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    model_id: MODEL_ID,
    version_id: MODEL_VERSION_ID, // This is optional. Defaults to the latest model version.
    inputs: [
      {
        data: {
          text: {
            raw: RAW_TEXT,
            // url: TEXT_URL, allow_duplicate_url: true
            // raw: fileBytes
          },
        },
      },
    ],
  },
  metadata,
  (err, response) => {
    if (err) {
      throw new Error(err);
    }

    if (response.status.code !== 10000) {
      console.log(response);
      throw new Error(
        "Post model outputs failed, status: " + response.status.description
      );
    }

    // Since we have one input, one output will exist here.
    const output = response.outputs[0];

    console.log("Completion:\n");
    console.log(output.data.text.raw);
  }
);
