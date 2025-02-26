import "./AudioControls.css"

interface AudioControlsProps {
  gain: number;
  bass: number;
  mids: number;
  treble: number;
  compressorThreshold: number;
  compressorKnee: number;
  compressorRatio: number;
  handleGainChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBassChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleMidChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTrebleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCompressorThresholdChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleCompressorKneeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCompressorRatioChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isFileLoaded: boolean;
}

const AudioControls: React.FC<AudioControlsProps> = ({
  gain,
  bass,
  mids,
  treble,
  compressorThreshold,
  compressorKnee,
  compressorRatio,
  handleGainChange,
  handleBassChange,
  handleMidChange,
  handleTrebleChange,
  handleCompressorThresholdChange,
  handleCompressorKneeChange,
  handleCompressorRatioChange,
  isFileLoaded,
}) => {
  return (
    <div className="sliders">
      <p>Gain: {gain}dB</p>
      <input
        type="range"
        min="0"
        max="20"
        step="0.25"
        value={gain}
        onChange={handleGainChange}
        disabled={!isFileLoaded}
      />

      <p>Bass: {bass}dB</p>
      <input
        type="range"
        min="-40"
        max="40"
        step="1"
        value={bass}
        onChange={handleBassChange}
        disabled={!isFileLoaded}
      />

      <p>Mid: {mids}dB</p>
      <input
        type="range"
        min="-40"
        max="40"
        step="1"
        value={mids}
        onChange={handleMidChange}
        disabled={!isFileLoaded}
      />

      <p>Treble: {treble}dB</p>
      <input
        type="range"
        min="-40"
        max="40"
        step="1"
        value={treble}
        onChange={handleTrebleChange}
        disabled={!isFileLoaded}
      />

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
  );
};

export default AudioControls;
