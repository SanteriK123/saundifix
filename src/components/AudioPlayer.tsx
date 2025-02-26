import "./AudioPlayer.css";

interface AudioPlayerProps {
  audioUrl: string;
  addEffects: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, addEffects }) => {
  return (
    <div className="audioPlayer">
      <button className="applyButton" onClick={addEffects}>
        Apply effects
      </button>
      <audio controls src={audioUrl}></audio>
    </div>
  );
};

export default AudioPlayer;
