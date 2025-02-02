/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { memo } from 'react';
import { Handle, NodeProps, Position } from '@xyflow/react';
import styled from 'styled-components';

export default memo(({ id, data, isConnectable }: NodeProps) => {
    console.log('data', data, Object.keys(data.parameters || {}))
  return (
    <StyledNode>
      <Handle
        type="target"
        position={Position.Top}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
        style={{ left: 0 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <div>
        text
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </StyledNode>
  );
});

const StyledNode = styled.div`
  border: solid 1px #000;
  width: 60px;
  border-radius: 0;
  background-color: #fff;
  height: 60px;
  transform: rotate(45deg);
  display: flex;

  &.selected {
    border-color: #ff4d08;
  }
`