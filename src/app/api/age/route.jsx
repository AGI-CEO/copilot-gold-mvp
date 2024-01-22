const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");
const dotenv = require("dotenv");
const Busboy = require("busboy");
dotenv.config();

const PAT = process.env.PAT;
const USER_ID = "clarifai";
const APP_ID = "main";
const MODEL_ID = "age-demographics-recognition";
const MODEL_VERSION_ID = "fb9f10339ac14e23b8e960e74984401b";

export async function POST(req, res) {
  console.log("Handler function called");
  if (req.method === "POST") {
    const busboy = new Busboy({ headers: req.headers });
    let image, timestamp;

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      if (fieldname === "image") {
        image = []; // We'll collect the data chunks in this array
        file.on("data", (data) => {
          image.push(data);
        });
        file.on("end", () => {
          image = Buffer.concat(image); // Combine the data chunks into a single buffer
        });
      }
    });

    busboy.on(
      "field",
      (
        fieldname,
        val,
        fieldnameTruncated,
        valTruncated,
        encoding,
        mimetype
      ) => {
        if (fieldname === "timestamp") {
          timestamp = val;
        }
      }
    );

    busboy.on("finish", () => {
      // At this point, we have the image data and the timestamp
      // You can now proceed with your existing code...

      const stub = ClarifaiStub.grpc();
      console.log("ClarifaiStub created");

      // This will be used by every Clarifai endpoint call
      const metadata = new grpc.Metadata();
      metadata.set("authorization", "Key " + PAT);
      console.log("Metadata set");

      stub.PostModelOutputs(
        {
          user_app_id: {
            user_id: USER_ID,
            app_id: APP_ID,
          },
          model_id: MODEL_ID,
          version_id: MODEL_VERSION_ID, // This is optional. Defaults to the latest model version
          inputs: [
            {
              data: {
                image: {
                  base64: image.toString("base64"),
                  allow_duplicate_url: true,
                },
              },
            },
          ],
        },
        metadata,
        (err, response) => {
          console.log("PostModelOutputs callback");
          if (err) {
            console.log("Error occurred: ", err.message);
            res.status(500).json({ error: err.message });
            return;
          }

          if (response.status.code !== 10000) {
            console.log(
              "Post model outputs failed, status: ",
              response.status.description
            );
            res.status(500).json({
              error:
                "Post model outputs failed, status: " +
                response.status.description,
            });
            return;
          }

          // Since we have one input, one output will exist here
          const output = response.outputs[0];
          console.log("Output received: ", output);

          const ageDemographics = output.data.concepts.map((concept) => ({
            name: concept.name,
            value: concept.value,
          }));
          console.log("Age demographics: ", ageDemographics);
          res.status(200).json(ageDemographics);
        }
      );
    });

    req.pipe(busboy);
  } else {
    // Handle any other HTTP method
    console.log(`Method ${req.method} Not Allowed`);
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
