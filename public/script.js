console.log("THE SCRIPT...");

const recordBtn = document.getElementById("recordBtn");
console.log("recordBtn");
const visualizer = document.getElementById("visualizer");
const outputVideo = document.getElementById("output-video");
const ctx = visualizer.getContext("2d");
let audioContext,
  mediaRecorder,
  source,
  analyser,
  audioChunks = [],
  isRecording = false;

async function startRecording() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
  });
  source = audioContext.createMediaStreamSource(stream);
  analyser = audioContext.createAnalyser();
  source.connect(analyser);
  analyser.fftSize = 2048;

  const canvasStream = visualizer.captureStream(25); // 25 FPS
  const combinedStream = new MediaStream([
    ...stream.getAudioTracks(),
    ...canvasStream.getVideoTracks(),
  ]);
  mediaRecorder = new MediaRecorder(combinedStream);
  mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);
  mediaRecorder.start();

  draw(); // Start the visualization
}

function draw() {
  if (!isRecording) return;
  requestAnimationFrame(draw);
  const frequencyData = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(frequencyData);

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, visualizer.width, visualizer.height);
  ctx.fillStyle = "white";
  let x = 0;
  const barWidth = visualizer.width / analyser.frequencyBinCount;
  for (let i = 0; i < analyser.frequencyBinCount; i++) {
    const barHeight = frequencyData[i];
    ctx.fillRect(x, visualizer.height - barHeight, barWidth, barHeight);
    x += barWidth + 1;
  }
}

async function stopRecording() {
  isRecording = false;
  mediaRecorder.stop();
  mediaRecorder.onstop = async () => {
    const blob = new Blob(audioChunks, { type: "video/webm" });
    outputVideo.src = URL.createObjectURL(blob);
    outputVideo.style.display = "block";
    audioContext.close();
    audioChunks = [];
    recordBtn.textContent = "Record";

    // Call the transcode function with the recorded blob
    //   transcode(blob);
  };
}

recordBtn.addEventListener("click", () => {
  if (!isRecording) {
    startRecording();
    recordBtn.textContent = "Stop";
    isRecording = true;
  } else {
    stopRecording();
  }
});

// const { fetchFile } = FFmpegUtil;
// const { FFmpeg } = FFmpegWASM;
// let ffmpeg = null;

// const transcodingMessage = document.getElementById("transcoding-message");
// const loader = transcodingMessage.querySelector(".loader");

const transcode = async (blob) => {
  transcodingMessage.style.display = "block";
  loader.style.display = "inline-block";

  if (ffmpeg === null) {
    ffmpeg = new FFmpeg();
    ffmpeg.on("log", ({ message }) => {
      console.log(message);
    });
    ffmpeg.on("progress", ({ progress, time }) => {
      console.log(`${progress * 100} %, time: ${time / 1000000} s`);
    });
    await ffmpeg.load({
      coreURL: "/assets/core/package/dist/umd/ffmpeg-core.js",
    });
  }
  const name = "input.webm";
  await ffmpeg.writeFile(name, await fetchFile(blob));
  console.log("Start transcoding");
  console.time("exec");
  await ffmpeg.exec(["-i", name, "output.mp4"]);
  console.timeEnd("exec");
  console.log("Complete transcoding");
  const data = await ffmpeg.readFile("output.mp4");

  const video = document.getElementById("output-video");
  video.src = URL.createObjectURL(
    new Blob([data.buffer], { type: "video/mp4" })
  );

  transcodingMessage.style.display = "none";
  loader.style.display = "none";
};
