import {
  Handle,
  Position,
  NodeProps,
  useNodeId,
  useOnSelectionChange,
  Node,
} from "@xyflow/react";
import { useFlowStore } from "../../stores/flow-store";
import { useState, useCallback } from "react";

interface NodeData {
  label: string;
  color: string;
}

export function ColorChooserNode({ data }: { data: NodeData }) {
  const [isSelected, setIsSelected] = useState(false);
  const updateNodeColor = useFlowStore((state) => state.updateNodeColor);
  const addNodeBelow = useFlowStore((state) => state.addNodeBelow);
  const nodeId = useNodeId();

  const onSelectionChange = useCallback(
    ({ nodes }: { nodes: Node[] }) => {
      setIsSelected(nodes.some((node) => node.id === nodeId));
    },
    [nodeId]
  );

  useOnSelectionChange({
    onChange: onSelectionChange,
  });

  if (!nodeId) return null;

  return (
    <div
      style={{
        background: data.color,
        padding: "15px",
        borderRadius: "5px",
        border: "1px solid black",
        position: "relative",
        boxShadow: isSelected ? "0 0 0 2px #1a192b" : "none",
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <div>
        <input
          type="color"
          defaultValue={data.color}
          onChange={(evt) => updateNodeColor(nodeId, evt.target.value)}
        />
        <div>{data.label}</div>
        <button
          className="nodrag"
          onClick={() => addNodeBelow(nodeId)}
          style={{
            position: "absolute",
            bottom: "-20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            width: "24px",
            height: "24px",
            borderRadius: "12px",
            border: "1px solid #ccc",
            background: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          +
        </button>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
}
