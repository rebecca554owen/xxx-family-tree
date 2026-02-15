import { BaseEdge, getSmoothStepPath, type EdgeProps } from "@xyflow/react";
import type { RelationType } from "../../types/family";

type EdgeData = {
  relationType: RelationType;
  lane?: number;
};

export function RelationshipEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  style,
  data,
  selected
}: EdgeProps) {
  const relationType = ((data as EdgeData | undefined)?.relationType ?? "parent") as RelationType;
  const lane = (data as EdgeData | undefined)?.lane ?? 0;

  const laneShift = lane * 24;

  const edgeStyle = {
    ...(style ?? {}),
    ...(selected
      ? {
          strokeWidth: Number((style as { strokeWidth?: number } | undefined)?.strokeWidth ?? 1.6) + 1.2,
          filter: "drop-shadow(0 0 4px rgba(166,58,46,0.55))"
        }
      : {})
  };

  const [path] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 16,
    centerX: (sourceX + targetX) / 2 + laneShift,
    offset: relationType === "sibling" ? 14 : 22
  });

  return <BaseEdge id={id} path={path} markerEnd={markerEnd} style={edgeStyle} />;
}
