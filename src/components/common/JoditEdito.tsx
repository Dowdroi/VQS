import React from "react";
import JoditEditor from "jodit-react";

interface JoditEditorAppProps {
  content: string;
  onChange: (content: string) => void;
  ref: any;
  className?: string;
  config?: any;
}

const JoditEditorApp: React.FC<JoditEditorAppProps> = ({
  content,
  onChange: handleChange,
  ref,
  className,
  config,
}) => (
  <JoditEditor
    ref={ref}
    value={content}
    onChange={handleChange}
    className={className}
    config={config}
  />
);

export default JoditEditorApp;
