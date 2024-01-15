import { useState } from "react";
import bufferToWav from "audiobuffer-to-wav";
import { FileUploader } from "react-drag-drop-files";
import "./App.css";

function App() {
  // Acceptable audio file types
  const audioTypes = ["mp3", "wav", "ogg", "flac", "m4a"];

  // Uploaded file states
  // const [playerDisabled, setPlayerDisabled] = useState(true);
  const [isFileLoaded, setIsFileLoaded] = useState(false);
  const [audioFile, setAudioFile] = useState<ArrayBuffer | null>(null);
  const [audioFileName, setAudioFileName] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  // Effect states
  const [gain, setGain] = useState(1);
  const [bass, setBass] = useState(0);
  const [mids, setMids] = useState(0);
  const [treble, setTreble] = useState(0);
  const [compressorThreshold, setCompressorThreshold] = useState(-24);
  const [compressorKnee, setCompressorKnee] = useState(30);
  const [compressorRatio, setCompressorRatio] = useState(1);

  // Audio context
  const AudioContext = window.AudioContext;
  const audioContext = new AudioContext();
  let offlineContext: OfflineAudioContext | null = null;

  // Styling
  const [fileUploaderStyle, setFileUploaderStyle] = useState("fileUploader");

  function handleFileChange(file: any) {
    setIsFileLoaded(false);
    if (!file) {
      return null;
    }
    const audioFile = file;
    setAudioFileName(audioFile.name);
    if (!audioFile) {
      return null;
    }

    // Read file as arraybuffer and pass to audio context to add effects
    const reader = new FileReader();
    reader.onload = function (e) {
      if (e.target?.result === null) {
        return null;
      }
      const audioData = e.target?.result as ArrayBuffer;
      const originalAudioUrl = URL.createObjectURL(audioFile);
      setAudioUrl(originalAudioUrl);
      setAudioFile(audioData);
      setIsFileLoaded(true);
    };
    reader.readAsArrayBuffer(audioFile);
    // setPlayerDisabled(false);
    setFileUploaderStyle("loaded");
    return null;
  }

  async function addEffects() {
    if (!audioFile) {
      return null;
    }
    try {
      const buffer = await audioContext.decodeAudioData(audioFile.slice(0));
      const length = buffer.duration * buffer.sampleRate;
      offlineContext = new OfflineAudioContext(2, length, 44100);
      const source = new AudioBufferSourceNode(offlineContext, {
        buffer: buffer,
      });

      const gainNode = offlineContext.createGain();
      const bassFilter = offlineContext.createBiquadFilter();
      const midFilter = offlineContext.createBiquadFilter();
      const trebleFilter = offlineContext.createBiquadFilter();

      const compressor = offlineContext.createDynamicsCompressor();

      // Effect parameters

      gainNode.gain.value = gain;

      bassFilter.type = "lowshelf";
      bassFilter.frequency.value = 100;
      bassFilter.gain.value = bass;

      midFilter.type = "peaking";
      midFilter.frequency.value = 1250;
      midFilter.Q.value = 1;
      midFilter.gain.value = mids;

      trebleFilter.type = "highshelf";
      trebleFilter.frequency.value = 5000;
      trebleFilter.gain.value = treble;

      compressor.threshold.value = compressorThreshold;
      compressor.knee.value = compressorKnee;
      compressor.ratio.value = compressorRatio;
      compressor.attack.value = 10;
      compressor.release.value = 80;

      // Effect chain
      source.connect(gainNode);
      gainNode.connect(bassFilter);
      bassFilter.connect(midFilter);
      midFilter.connect(trebleFilter);
      trebleFilter.connect(compressor);
      compressor.connect(offlineContext.destination);

      source.start();
      const renderedBuffer = await offlineContext.startRendering();

      // Convert mixed buffer to wav and create new url
      const wavBlob = new Blob([bufferToWav(renderedBuffer)], {
        type: "audio/wav",
      });
      const url = URL.createObjectURL(wavBlob);
      setAudioUrl(url);
    } catch (error) {
      console.error("Error decoding audio data", error);
    }
  }

  function handleBassChange(event: React.ChangeEvent<HTMLInputElement>) {
    setBass(parseInt(event.target.value));
  }

  function handleMidChange(event: React.ChangeEvent<HTMLInputElement>) {
    setMids(parseInt(event.target.value));
  }

  function handleTrebleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTreble(parseInt(event.target.value));
  }

  function handleCompressorThresholdChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setCompressorThreshold(parseInt(event.target.value));
  }

  function handleCompressorKneeChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setCompressorKnee(parseInt(event.target.value));
  }

  function handleCompressorRatioChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setCompressorRatio(parseInt(event.target.value));
  }

  function handleGainChange(event: React.ChangeEvent<HTMLInputElement>) {
    setGain(parseFloat(event.target.value));
  }

  return (
    <div className="app">
      <div className="logo">
        <h1>Saundifix</h1>
      </div>
      <div className="content">
        <FileUploader
          handleChange={handleFileChange}
          name="file"
          types={audioTypes}
          onDraggingStateChange={(dragging: any) => {
            if (dragging) {
              setFileUploaderStyle("dragging");
            }
          }}
          onTypeError={(error: any) => {
            if (error) {
              setFileUploaderStyle("error");
              console.log("moi");
            } else {
              setFileUploaderStyle("fileUploader");
            }
          }}
          children={
            <div className="fileUploader" data-state={fileUploaderStyle}>
              Drag and drop audio file here {audioFileName}
            </div>
          }
        />
        <div className="sliders">
          <div>
            <p>Gain: {gain}dB</p>
            <input
              name="gain"
              type="range"
              min="0"
              max="20"
              step="0.25"
              value={gain}
              onChange={handleGainChange}
              disabled={!isFileLoaded}
            />
          </div>
          <div className="bassSlider">
            <p>Bass: {bass}dB</p>
            <input
              name="bass"
              type="range"
              min="-40"
              max="40"
              step="1"
              value={bass}
              onChange={handleBassChange}
              disabled={!isFileLoaded}
            />
          </div>
          <div className="midSlider">
            <p>Mid: {mids}dB</p>
            <input
              name="mid"
              type="range"
              min="-40"
              max="40"
              step="1"
              value={mids}
              onChange={handleMidChange}
              disabled={!isFileLoaded}
            />
          </div>
          <div className="trebleSlider">
            <p>Treble: {treble}dB</p>
            <input
              name="treble"
              type="range"
              min="-40"
              max="40"
              step="1"
              value={treble}
              onChange={handleTrebleChange}
              disabled={!isFileLoaded}
            />
          </div>
          <p>Compressor Threshold: {compressorThreshold}dB</p>
          <input
            type="range"
            min="-100"
            max="0"
            step="1"
            value={compressorThreshold}
            onChange={handleCompressorThresholdChange}
            disabled={!isFileLoaded}
          />
          <p>Compressor Knee: {compressorKnee}</p>
          <input
            type="range"
            min="0"
            max="40"
            step="1"
            value={compressorKnee}
            onChange={handleCompressorKneeChange}
            disabled={!isFileLoaded}
          />
          <p>Compressor Ratio: {compressorRatio}</p>
          <input
            type="range"
            min="1"
            max="20"
            step="1"
            value={compressorRatio}
            onChange={handleCompressorRatioChange}
            disabled={!isFileLoaded}
          />
        </div>
        <div className="fileOutput">
          <button onClick={addEffects}>Apply effects</button>
        </div>
        <audio controls src={audioUrl}></audio>
      </div>
    </div>
  );
}
export default App;
