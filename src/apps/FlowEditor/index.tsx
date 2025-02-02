import { useState } from "react";
import FlowWithProvider from "./FlowEditor";
import { themeNode } from "../../theme";
import Timeline from "../../components/Timeline";

const nodesSample_1: Node<any, string>[] = [
  {
    id: '1',
    type: 'group',
    data: { label: null },
    position: { x: 0, y: 0 },
    style: {
      width: 170,
      height: 140,
      backgroundColor: '#fff',  
      borderRadius: 0,
      boxShadow: '4.0px 8.0px 8.0px hsl(0deg 0% 0% / 0.38)',
    },
  },
  // {
  //   id: '2',
  //   type: 'group',
  //   data: { label: 'null' },
  //   position: { x: 10, y: 10 },
  //   parentId: '1',
  //   extent: 'parent',
  //   style: {
  //     width: 150,
  //     height: 120,
  //     backgroundColor: '#fff',
  //     borderRadius: 0,  
  //     boxShadow: '4.0px 8.0px 8.0px hsl(0deg 0% 0% / 0.38)',
  //   },
  // },
  {
    id: 'A',
    type: 'flowactor',
    data: { label: 'child node 1' },
    position: { x: 10, y: 10 },
    // parentId: '2',
    // extent: 'parent',
  },
  {
    id: 'B',
    type: 'flowcondition',
    data: { label: 'child node 1' },
    position: { x: 10, y: 10 },
    // parentId: '2',
    // extent: 'parent',
  }
]

const nodesSample_2: Node<any, string>[] = [
  {
    id: 'timeline',
    type: 'skeleton',
    data: {
      child: <Timeline startDate={"2025-01-01"} endDate={"2025-03-31"} />
    },
    position: { x: 0, y: 0 },
    style: { 
      ...themeNode,
      width: 1000
    },
  },
  {
    id: '1',
    type: 'group',
    data: { down: 'timeline' },
    position: { x: 0, y: 0 },
    style: {
      width: 1000
    },
    draggable: false
  },
  {
    id: '1-node',
    type: 'default',
    data: { label: 'task' },
    position: { x: 0, y: 0 },
    style: { ...themeNode},
    parentId: '1',
    extent: 'parent',
  },
  {
    id: '2',
    type: 'group',
    data: { down: '1' },
    position: { x: 0, y: 0 },
    style: {
      width: 1000
    },
    draggable: false
  },
  {
    id: '2-node',
    type: 'default',
    data: { label: 'task' },
    position: { x: 0, y: 0 },
    style: { ...themeNode},
    parentId: '2',
    extent: 'parent',
  },
  {
    id: '3',
    type: 'group',
    data: { down: '2' },
    position: { x: 0, y: 0 },
    style: {
      width: 1000
    },
    draggable: false
  },
  {
    id: '3-node',
    type: 'default',
    data: { label: 'task' },
    position: { x: 0, y: 0 },
    style: { ...themeNode},
    parentId: '3',
    extent: 'parent',
  },
]

function App() {
  const [nodes, setNodes] = useState(nodesSample_1);

  return (
    <FlowWithProvider initialNodes={nodes} />
  );
}
export default App;
