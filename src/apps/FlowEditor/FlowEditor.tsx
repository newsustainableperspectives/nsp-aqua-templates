/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { Download, Save, Trash } from 'lucide-react';

import { Button } from '@nsp-aqua/react';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  useOnSelectionChange,
  Node,
  Connection,
  Edge,
  ReactFlowInstance,
  BackgroundVariant,
  Background,
  ConnectionLineType,
  OnConnectStart,
  OnConnectEnd,
  XYPosition,
  PanOnScrollMode,
  applyNodeChanges,
  getNodesBounds,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import styled from 'styled-components';

import store from '../../context/store';

import FlowEventNode from '../../nodeTypes/FlowEventNode';
import FlowConditionNode from '../../nodeTypes/FlowConditionNode';
import { themeNode } from '../../theme';
import MindmapNode from '../../nodeTypes/MindmapNode';
import MindmapEdge from '../../nodeTypes/MindmapEdge';
import NodeSkeleton from '../../nodeTypes/NodeSkeleton';
import NodeSimple from '../../nodeTypes/NodeSimple';
import ContainerSimple from '../../nodeTypes/ContainerSimple';

// import './index.css';

// const initialNodes: Node<any, string>[] = [
//   {
//     id: '1',
//     data: { label: 'Hello' },
//     position: { x: 0, y: 0 },
//     type: 'input',
//   },
//   {
//     id: '2',
//     data: { label: 'World' },
//     position: { x: 100, y: 100 },
//     type: 'flownode'
//   },
// ]

const initialEdges = [
  // {
  //   type: 'step',
  //   source: 'TriggerSendEmail',
  //   target: 'ActionSendEmail',
  //   id: 'TriggerSendEmail-ActionSendEmail',
  //   label: '',
  // },
  // {
  //   type: 'step',
  //   source: 'TriggerSaveEntry',
  //   target: 'ActionSaveEntry',
  //   id: 'TriggerSaveEntry-ActionSaveEntry',
  //   label: '',
  // },
  // {
  //   type: 'step',
  //   source: 'TriggerSaveItemToCollection',
  //   target: 'ActionSendToast',
  //   id: 'TriggerSaveItemToCollection-ActionSendToast',
  //   label: '',
  // },
  // {
  //   type: 'step',
  //   source: 'ActionSendToast',
  //   target: 'ActionRedirectTo',
  //   id: 'ActionSendToast-ActionRedirectTo',
  //   label: '',
  // },
]

let id = 0;
const getId = () => `dndnode_${id++}`;

const nodeTypes = {
  'flowactor': FlowEventNode,
  'flowcondition': FlowConditionNode,
  'mindmap': MindmapNode,
  'skeleton': NodeSkeleton,
  'default': NodeSimple,
  'group': ContainerSimple,
};

const edgeTypes = {
  'mindmap': MindmapEdge,
};

const getChildNodePosition = (event: MouseEvent, instance: ReactFlowInstance, parentNode?: Node) => {
  if(!parentNode) return
  if (
    // we need to check if these properites exist, because when a node is not initialized yet,
    // it doesn't have a positionAbsolute nor a width or height
    !parentNode?.measured?.width ||
    !parentNode?.measured?.height
  ) {
    return;
  }
 
  const panePosition = instance.screenToFlowPosition({
    x: event.clientX,
    y: event.clientY,
  });
 
  // we are calculating with positionAbsolute here because child nodes are positioned relative to their parent
  return {
    x:
      panePosition.x -
      parentNode.position.x +
      parentNode.measured?.width / 2,
    y:
      panePosition.y -
      parentNode.position.y +
      parentNode.measured?.height / 2,
  };
};

const FlowEditor: React.FC<any> = ({
  initialNodes
}) => {
  // const {nodesStore, edgesStore} = useSelector(store, (state) => state.context);

  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance>();
  const rfInstance = useReactFlow();
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [selectedEdges, setSelectedEdges] = useState<string[]>([]);

  useEffect(() => {
    console.log('nodes updated', rfInstance.getNodes())
    setNodes((nds) => {
      let cursorPosition = { x: 0, y: 0 }
      const prepared = nds.map((node) => {
        // it's important that you create a new node object
        // in order to notify react flow about the change

        if(node.data.down) {
          const parentNode = nds.find((nodeLookup) => nodeLookup.id === node.data.down);
          // console.log(nds)
          if(!parentNode) return node;

          const parentNodeBounds = rfInstance.getNodesBounds([parentNode])
          // console.log(parentNodeBounds)

          cursorPosition = {
            x: cursorPosition.x,
            y: cursorPosition.y +
              (parentNodeBounds.height),
          }
      
          return {
            ...node,
            position: {
              ...node.position,
              ...cursorPosition
            }
          }
        } else {
          return node
        }
      })

      return prepared.map((node) => {
        return {
          ...node,
          position: {
            ...node.position,
          },
          style: {
            ...node.style,
          }
        }
      })
    });
  }, [initialNodes, rfInstance])

  //   if(containersToStack.length > 0) setNodes([...rfInstance.getNodes().filter(node => !node.data.down), ...containersToStack]);

  //   setNodes([...rfInstance.getNodes(), ...containersToStack]);

  //   // if(rfInstance.getNodes().find(node => node.measured) === undefined) return
  //   // setTimeout(() => {
  //     // }, 1000)
  //   }, [nodes])
    
  useOnSelectionChange({
    onChange: ({ nodes, edges }: any) => {
      setSelectedNodes(nodes.map((node: any) => node.id));
      setSelectedEdges(edges.map((edge: any) => edge.id));
    },
  });

  const addNode = (parentNode: Node, position: XYPosition) => {
    const newNode = {
      id: (Math.floor(Math.random() * 1000) + 1).toString(),
      type: 'mindmap',
      data: { 
        label: 'New Node',
        onChangeLabel: (nodeId: string, label: string) => {
          const newNodes = rfInstance.getNodes().map((node) => {
            if (node.id === nodeId) {
              // it's important to create a new object here, to inform React Flow about the cahnges
              return { ...node, data: { ...node.data, label } };
            }
     
            return node;
          })
          console.log(newNodes)
        }
      },
      position,
      style: {...themeNode},
      dragHandle: '.dragHandle',
      parentId: parentNode.id,
    };

    const newEdge = {
      id: (Math.floor(Math.random() * 1000) + 1).toString(),
      type: 'mindmap',
      source: parentNode.id,
      target: newNode.id,
    };

    setNodes([...rfInstance.getNodes(), newNode]);
    setEdges([...rfInstance.getEdges(), newEdge]);
  }

  const connectingNodeId = useRef<string | null>(null);
 
  const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);
 
  const onConnectEnd: OnConnectEnd = useCallback((event: any) => {
    // console.log('onConnectEnd', event)
    // we only want to create a new node if the connection ends on the pane
    const targetIsPane = (event.target as Element).classList.contains(
      'react-flow__pane',
    );
  
    if (targetIsPane && connectingNodeId.current && rfInstance) {
      const parentNode = rfInstance.getNodes().find((node) => node.id == connectingNodeId.current);
      const childNodePosition = getChildNodePosition(event, rfInstance, parentNode);
      // console.log('onConnectEnd', parentNode, childNodePosition)

      if (parentNode && childNodePosition) {
        addNode(parentNode, childNodePosition);
      }
    }
  }, []);

  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      localStorage.setItem('nsp-flow', JSON.stringify(flow));
    }
  }, [reactFlowInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem('nsp-flow'));

      if (flow) {
        // const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        rfInstance.setNodes(flow.nodes || []);
        rfInstance.setEdges(flow.edges || []);
        // setEdges(flow.edges || []);
        // setViewport({ x, y, zoom });
      }
    };

    restoreFlow();
  }, [rfInstance]);

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    if(event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }, []);

  const onDelete = useCallback(() => {
      console.log('selectedEdges', selectedEdges)
      setEdges(edges.filter(edge => edge.id !== selectedEdges[0]));
  }, [selectedEdges, selectedNodes])

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();

      if(!event.dataTransfer || !reactFlowInstance) return

      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds: any) => nds.concat(newNode));
    },
    [reactFlowInstance],
  );

  return (<StyledContainer>
      <button
        onClick={onSave}
        style={{ width: 40, padding: 0 }}
      >
        <Save className="h-4 w-4" color="#000" />
      </button>
      <button
        onClick={onRestore}
        style={{ width: 40, padding: 0 }}
      >
        <Download className="h-4 w-4" color="#000" />
      </button>
      <button
        onClick={onDelete}
        style={{ width: 40, padding: 0 }}
      >
        <Trash className="h-4 w-4" color="#000" />
      </button>
      <div className="dndflow">
        {/* <ReactFlowProvider> */}
          <div className="reactflow-wrapper h-screen" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              nodeTypes={nodeTypes}
              edges={edges}
              edgeTypes={edgeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onInit={setReactFlowInstance}
              onConnectStart={onConnectStart}
              onConnectEnd={onConnectEnd}
              onDrop={onDrop}
              onDragOver={onDragOver}
              connectionLineType={ConnectionLineType.Straight}
              // nodeOrigin={[0.5, 0.5]}
              snapGrid={[10, 10]}
              snapToGrid
              fitView
              // fitViewOptions={{
              //   // padding: 0.1,
              //   // includeHiddenNodes: false,
              //   minZoom: 1,
              //   maxZoom: 1,
              //   // duration: 200,
              //   // nodes: [{id: 'node-1'}, {id: 'node-2'}], // nodes to fit
              //  }}

              // panOnDrag={false}
              // panOnScroll={true}
              // panOnScrollMode={PanOnScrollMode.Horizontal}
            >
              {/* <Background
                id="1"
                gap={50}
                color="#25525a"
                variant={BackgroundVariant.Lines}
              /> */}
              {/* <Background
                id="2"
                gap={100}
                color="#e0e0e0"
                variant={BackgroundVariant.Lines}
              /> */}
              <Controls />
            </ReactFlow>
          </div>
          {/* <Sidebar /> */}
          {/* <div>
            <p>Selected nodes: {selectedNodes.join(', ')}</p>
            <p>Selected edges: {selectedEdges.join(', ')}</p>
          </div> */}
        {/* </ReactFlowProvider> */}
      </div>
    </StyledContainer>
  );
};

function FlowWithProvider(props: React.JSX.IntrinsicAttributes | { initialNodes: any}) {
  return (
    <ReactFlowProvider>
      <FlowEditor {...props} />
    </ReactFlowProvider>
  );
}

export default FlowWithProvider;

const StyledContainer = styled.div`
  flex-direction: column;
  display: flex;
  flex-grow: 1;
  height: 100%;
  
  .dndflow {
    flex-direction: column;
    display: flex;
    flex-grow: 1;
    height: 100%; 
  }

  .dndflow aside {
    border-right: 1px solid #eee;
    padding: 15px 10px;
    font-size: 12px;
    background: #fcfcfc;
  }

  .dndflow aside .description {
    margin-bottom: 10px;
  }

  .dndflow .dndnode {
    height: 20px;
    padding: 4px;
    border: 1px solid #1a192b;
    border-radius: 2px;
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: grab;
  }

  .dndflow .dndnode.input {
    border-color: #0041d0;
  }

  .dndflow .dndnode.output {
    border-color: #ff0072;
  }

  .dndflow .reactflow-wrapper {
    flex-grow: 1;
    height: 100%;
  }

  .dndflow .selectall {
    margin-top: 10px;
  }

  @media screen and (min-width: 768px) {
    .dndflow {
      flex-direction: row;
    }

    .dndflow aside {
      width: 20%;
      max-width: 250px;
    }
  }

`