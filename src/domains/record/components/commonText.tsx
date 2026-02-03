export const Placeholder = ({ text }: { text?: string }) => {
  return <p className="text-shadow text-sm pl-[0.2rem]">{text}</p>;
};

export const Heading = ({ text }: { text?: string }) => {
  return <h2 className="text-lg font-semibold pl-[0.2rem]">{text}</h2>;
};
