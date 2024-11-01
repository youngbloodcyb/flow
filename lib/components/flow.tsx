"use client";

import { ReactFlow, Background, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useFlowStore } from "../stores/flow-store";
import { ColorChooserNode } from "./ColorChooserNode";

const nodeTypes = {
  colorChooser: ColorChooserNode,
};

export function Flow() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useFlowStore();

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgesFocusable={false}
        nodesDraggable={false}
        nodesConnectable={false}
        // elementsSelectable={false}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
