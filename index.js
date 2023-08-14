const express = require("express");
const ffmpegStatic = require("ffmpeg-static");
const ffmpeg = require("fluent-ffmpeg");

// Create an instance of the express application
const app = express();

app.get("/process-video", (req, res) => {
  // Call the FFmpeg processing function here
  ffmpeg.setFfmpegPath(ffmpegStatic);
  ffmpeg()
    .input("./asset/frame-002.mp4")
    .input("./asset/frame-001.png")
    .complexFilter(
      [
        // Resize the image using the 'scale' filter
        {
          filter: "scale",
          options: "100:100", // Set the desired width and height here (e.g., "100:100" for 100x100 pixels)
          inputs: "[1:v]",
          outputs: "resized_image",
        },
        // Overlay the resized image onto the video
        {
          filter: "overlay",
          options: "1:2", // Adjust the position (x, y) where the image will be placed on the video
          inputs: ["0:v", "resized_image"],
          outputs: "output_video",
        },
      ],
      "output_video"
    )

    .outputOptions("-c:v", "libx264")
    .outputOptions("-pix_fmt", "yuv420p")
    .saveToFile("final_video.mp4")
    .on("progress", (progress) => {
      if (progress.percent) {
        console.log(`Processing video: ${Math.floor(progress.percent)}% done`);
      }
    })
    .on("end", () => {
      console.log("FFmpeg has finished.");
    })
    .on("error", (error) => {
      console.error(error);
    });
});

const port = 3000; // You can use any port number you prefer
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
