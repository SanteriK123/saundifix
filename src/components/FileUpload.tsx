import { FileUploader } from "react-drag-drop-files";
import "./FileUpload.css";

interface FileUploadProps {
  onFileUpload: (file: File | null) => void;
  audioFileName: string;
}

const audioTypes = ["mp3", "wav", "ogg", "opus", "flac", "m4a"];

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  audioFileName,
}) => {
  return (
    <FileUploader handleChange={onFileUpload} name="file" types={audioTypes}>
      <div className="fileUploader">
        <span>Drag and drop audio file here: {audioFileName}</span>
      </div>
    </FileUploader>
  );
};

export default FileUpload;
