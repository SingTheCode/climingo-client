import Image, { ImageProps } from "next/image";

interface AvatarProps extends ImageProps {
  size: "xs" | "sm" | "base" | "lg" | "xl";
}

export default function Avatar({ size, src, alt }: AvatarProps) {
  const refineSize = () => {
    switch (size) {
      case "xs":
        return "20";
      case "sm":
        return "40";
      case "base":
        return "60";
      case "lg":
        return "80";
      case "xl":
        return "100";
    }
  };

  return (
    <Image
      className="rounded-full"
      src={src}
      alt={alt}
      width={refineSize()}
      height={refineSize()}
    />
  );
}
