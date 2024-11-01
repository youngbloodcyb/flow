import { create } from "zustand";
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from "@xyflow/react";

type FlowState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  updateNodeColor: (nodeId: string, color: string) => void;
  addNodeBelow: (parentNodeId: string) => void;
};

// Initial nodes - you can modify these as needed
const initialNodes: Node[] = [
  {
    id: "1",
    type: "colorChooser",
    data: { label: "Node 1", color: "#ffffff" },
    position: { x: 250, y: 5 },
    draggable: false,
  },
];

// Initial edges - you can modify these as needed
const initialEdges: Edge[] = [];

export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,

  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },

  updateNodeColor: (nodeId: string, color: string) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: { ...node.data, color },
          };
        }
        return node;
      }),
    });
  },

  addNodeBelow: (parentNodeId: string) => {
    const parentNode = get().nodes.find((node) => node.id === parentNodeId);
    if (!parentNode) return;

    // Find existing child nodes of the parent
    const childNodes = get().nodes.filter((node) =>
      get().edges.some(
        (edge) => edge.source === parentNodeId && edge.target === node.id
      )
    );

    const newNodeId = `node-${get().nodes.length + 1}`;
    const spacing = 150; // Horizontal spacing between siblings

    // Calculate new positions
    const numChildren = childNodes.length;
    const totalWidth = spacing * numChildren;
    const startX = parentNode.position.x - totalWidth / 2;

    // Reposition existing child nodes
    const updatedNodes = get().nodes.map((node) => {
      if (childNodes.includes(node)) {
        const index = childNodes.indexOf(node);
        return {
          ...node,
          position: {
            x: startX + index * spacing,
            y: parentNode.position.y + 150,
          },
        };
      }
      return node;
    });

    // Create new node
    const newNode: Node = {
      id: newNodeId,
      type: "colorChooser",
      position: {
        x: startX + numChildren * spacing,
        y: parentNode.position.y + 150,
      },
      data: {
        label: `Node ${get().nodes.length + 1}`,
        color: "#ffffff",
      },
      draggable: false,
    };

    const newEdge: Edge = {
      id: `edge-${parentNodeId}-${newNodeId}`,
      source: parentNodeId,
      target: newNodeId,
    };

    set({
      nodes: [...updatedNodes, newNode],
      edges: [...get().edges, newEdge],
    });
  },
}));
