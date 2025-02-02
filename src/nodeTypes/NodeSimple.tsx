/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { memo } from 'react';
import { Handle, NodeProps, NodeResizer, Position, useReactFlow } from '@xyflow/react'
import styled from 'styled-components'
import {GripVertical} from 'lucide-react'

const NodeSimple = (({ id, data, isConnectable }: NodeProps) => {
  const rfInstance = useReactFlow();
  
  return (
    <StyledNode>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div className="flex">
        <div className="dragHandle">
          <GripVertical />
        </div>
        <input
          type="text"
          value={data.label}
          onChange={(evt) => {
            const newNodes = rfInstance.getNodes().map((node) => {
              if (id === node.id) {
                // it's important to create a new object here, to inform React Flow about the cahnges
                return { ...node, data: { ...node.data, label: evt.target.value } };
              }
       
              return node;
            })
            rfInstance.setNodes(newNodes)
            console.log(newNodes)
          }}
          className="nodrag"
        />
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </StyledNode>
  );
});
export default NodeSimple

const StyledNode = styled.div`
  padding: 5px;
`