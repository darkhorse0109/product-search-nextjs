interface IRequiredLabel {
  className?: string;
}

const RequiredLabel: React.FC<IRequiredLabel> = ({ className = "" }) => {
  return (
    <span
      className={`bg-m-red text-white text-[10px] px-2 pt-[2px] pb-1 font-semibold ml-2 ${className}`}
    >
      必須
    </span>
  );
};

export default RequiredLabel;
