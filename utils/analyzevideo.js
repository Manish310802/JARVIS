import * as faceapi from 'face-api.js';

// Function to load models
export async function loadFaceModels() {
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models/tiny_face_detector'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models/face_expression')
  ]);
}

// Function to analyze the video blob
export async function analyzeVideoBlob(videoBlob) {
  return new Promise(async (resolve) => {
    const video = document.createElement('video');
    video.src = URL.createObjectURL(videoBlob);
    video.crossOrigin = "anonymous";
    await video.play();

    const expressionsData = [];
    const canvas = document.createElement('canvas'); // not shown in UI
    const ctx = canvas.getContext('2d');

    const interval = setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections.length > 0) {
        detections.forEach(det => {
          expressionsData.push(det.expressions);
        });
      }
    }, 800); // Capture every 800ms

    video.onended = async () => {
      clearInterval(interval);

      // Analyze collected expression frames
      const summary = summarizeExpressions(expressionsData);

      resolve(summary);
    };
  });
}

// Helper to summarize the emotions detected
function summarizeExpressions(data) {
  const totalFrames = data.length;
  if (totalFrames === 0) return null;

  const emotionCounts = {
    happy: 0,
    sad: 0,
    angry: 0,
    fearful: 0,
    disgusted: 0,
    surprised: 0,
    neutral: 0
  };

  data.forEach(frame => {
    const sorted = Object.entries(frame).sort((a, b) => b[1] - a[1]);
    const topEmotion = sorted[0][0];
    emotionCounts[topEmotion]++;
  });

  // Calculate percentages
  for (let emotion in emotionCounts) {
    emotionCounts[emotion] = Math.round((emotionCounts[emotion] / totalFrames) * 100);
  }

  return emotionCounts;
}
