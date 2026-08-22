import { getStageLabel, getStageBadgeClass } from "@/lib/utils";
import type { BusinessStage } from "@/types";

interface BusinessStageBadgeProps {
  stage: BusinessStage;
  size?: "sm" | "md";
}

export function BusinessStageBadge({ stage, size = "sm" }: BusinessStageBadgeProps) {
  return (
    <span
      className={getStageBadgeClass(stage)}
      style={{
        fontSize: size === "sm" ? 11 : 12,
        padding: size === "sm" ? "2px 8px" : "3px 10px",
      }}
    >
      {getStageLabel(stage)}
    </span>
  );
}
