import { cn } from "@/lib/utils";
import { View } from "react-native";

type InfoCardProps = {
  className?: string;
  children: React.ReactNode;
};

function InfoCardRoot({ className, children }: InfoCardProps) {
  return (
    <View
      className={cn(
        "bg-primary/5 aspect-video rounded-lg p-4 flex flex-row items-center",
        className
      )}
    >
      {children}
    </View>
  );
}

type ContentProps = {
  className?: string;
  children: React.ReactNode;
};

function Content({ className, children }: ContentProps) {
  return (
    <View className={cn("flex flex-row items-center gap-4", className)}>
      {children}
    </View>
  );
}

type NumberColumnProps = {
  className?: string;
  children: React.ReactNode;
};

function NumberColumn({ className, children }: NumberColumnProps) {
  return (
    <View
      className={cn("font-bold text-3xl md:text-6xl text-primary", className)}
    >
      {children}
    </View>
  );
}

type DescriptionColumnProps = {
  className?: string;
  children: React.ReactNode;
};

function DescriptionColumn({ className, children }: DescriptionColumnProps) {
  return <View className={cn(className)}>{children}</View>;
}

export const InfoCard = {
  Root: InfoCardRoot,
  Content,
  NumberColumn,
  DescriptionColumn,
};
