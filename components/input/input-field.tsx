"use client";

import { Input } from "@/components/ui/input";
import { Control, Controller } from "react-hook-form";

interface ThisFCProps {
  id: string;
  value?: string;
  placeholder?: string;
  isPassword?: boolean;
  className?: string;
  disabled?: boolean;
  control?: Control<any>;
}

const InputField: React.FC<ThisFCProps> = ({
  id,
  placeholder,
  isPassword = false,
  value = "",
  className,
  disabled,
  control,
}) => {
  return (
    <Controller
      name={id}
      control={control}
      defaultValue={value}
      render={({ field }) => (
        <Input
          {...field}
          id={id}
          disabled={disabled}
          className={`max-w-[640px] text-[15px] rounded-none ${className} ${
            disabled ? "bg-[#e6e6e6] font-bold" : ""
          } px-3 py-1`}
          placeholder={placeholder}
          type={isPassword === false ? "text" : "password"}
        />
      )}
    />
  );
};

export default InputField;
