import React from "react";
import { Textarea } from "@/components/ui/textarea";

type TextInputProps = {
  value: string;
  onChange: (value: string) => void;
};

const TextInput: React.FC<TextInputProps> = ({ value, onChange }) => {
  return (
    <Textarea
      rows={8}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="区別する形式を入力してください。"
    />
  );
};

export default TextInput;
