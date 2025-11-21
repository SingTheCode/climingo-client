import Image, { ImageProps } from "next/image";

interface AvatarProps extends Omit<ImageProps, 'width' | 'height'> {
  size: "xs" | "sm" | "base" | "lg" | "xl";
}

const refineSize = (size: AvatarProps["size"]) => {
  switch (size) {
    case "xs":
      return 20;
    case "sm":
      return 40;
    case "base":
      return 60;
    case "lg":
      return 80;
    case "xl":
      return 100;
  }
};

export default function Avatar({ size, src, alt, ...props }: AvatarProps) {
  return (
    <Image
      className="rounded-full"
      src={src}
      alt={alt}
      width={refineSize(size)}
      height={refineSize(size)}
      {...props}
    />
  );
}
