type ChatWrapperProps = {
  children: React.ReactNode | React.ReactNode[];
};

export const ChatWrapper = ({ children }: ChatWrapperProps) => {
  return <section>{children}</section>;
};
