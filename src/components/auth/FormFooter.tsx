interface IFormFooter {
  text: string;
  linkText: string;
  onPress: () => void;
}

export const FormFooter = ({ text, linkText, onPress }: IFormFooter) => {
  return (
    <div className="flex items-center justify-center pt-1">
      <span
        className="text-body-sm font-normal text-muted-foreground text-center"
      >
        {text}
        <span
          className="font-medium text-accent cursor-pointer"
          onClick={onPress}
        >
          {linkText}
        </span>
      </span>
    </div>
  );
};
