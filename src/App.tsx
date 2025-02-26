import { useState } from "react";
import bufferToWav from "audiobuffer-to-wav";
import FileUpload from "./components/FileUpload";
import AudioControls from "./components/AudioControls";
import AudioPlayer from "./components/AudioPlayer";
import "./App.css";

function App() {
  const [isFileLoaded, setIsFileLoaded] = useState(false);
  const [audioFile, setAudioFile] = useState<ArrayBuffer | null>(null);
  const [audioFileName, setAudioFileName] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  const [gain, setGain] = useState(1);
  const [bass, setBass] = useState(0);
  const [mids, setMids] = useState(0);
  const [treble, setTreble] = useState(0);
  const [compressorThreshold, setCompressorThreshold] = useState(-24);
  const [compressorKnee, setCompressorKnee] = useState(30);
  const [compressorRatio, setCompressorRatio] = useState(1);

  const audioContext = new window.AudioContext();
  let offlineContext: OfflineAudioContext | null = null;

  function handleFileChange(file: File | null) {
    setIsFileLoaded(false);
    if (!file) return;

    setAudioFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const audioData = e.target.result as ArrayBuffer;
        setAudioFile(audioData);
        setAudioUrl(URL.createObjectURL(file));
        setIsFileLoaded(true);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  async function addEffects() {
    if (!audioFile) return;
    try {
      const buffer = await audioContext.decodeAudioData(audioFile.slice(0));
      const length = buffer.duration * buffer.sampleRate;
      offlineContext = new OfflineAudioContext(2, length, 44100);
      const source = new AudioBufferSourceNode(offlineContext, { buffer });

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
      setAudioUrl(URL.createObjectURL(wavBlob));
    } catch (error) {
      console.error("Error processing audio:", error);
    }
  }

  return (
    <div className="app">
      <div className="logo">
        <h1>Saundifix</h1>
      </div>
      <div className="content">
        <FileUpload
          onFileUpload={handleFileChange}
          audioFileName={audioFileName}
        />
        <AudioControls
          gain={gain}
          bass={bass}
          mids={mids}
          treble={treble}
          compressorThreshold={compressorThreshold}
          compressorKnee={compressorKnee}
          compressorRatio={compressorRatio}
          handleGainChange={(e) => setGain(parseFloat(e.target.value))}
          handleBassChange={(e) => setBass(parseInt(e.target.value))}
          handleMidChange={(e) => setMids(parseInt(e.target.value))}
          handleTrebleChange={(e) => setTreble(parseInt(e.target.value))}
          handleCompressorThresholdChange={(e) =>
            setCompressorThreshold(parseInt(e.target.value))
          }
          handleCompressorKneeChange={(e) =>
            setCompressorKnee(parseInt(e.target.value))
          }
          handleCompressorRatioChange={(e) =>
            setCompressorRatio(parseInt(e.target.value))
          }
          isFileLoaded={isFileLoaded}
        />
        <AudioPlayer audioUrl={audioUrl} addEffects={addEffects} />
      </div>
    </div>
  );
}

export default App;
