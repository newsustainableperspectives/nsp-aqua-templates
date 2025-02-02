/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { memo } from 'react';
import { Handle, NodeResizer, Position } from '@xyflow/react';
import styled from 'styled-components';

export default memo(({ data, isConnectable }: { data: any, isConnectable: any }) => {
    console.log('data', data, Object.keys(data.parameters || {}))
  return (
    <StyledNode>
      <NodeResizer minWidth={100} minHeight={30} />
      <Handle
        type="target"
        position={Position.Top}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <div>
        Name: {data.label}<br/>
        Parameters:<br/>
        {Object.keys(data.parameters || {}).map((key) => {
            return (
                <div key={key} className="flex">
                    <div className="w-full">
                        {key}
                    </div>
                    <div className="w-full">
                        {data.parameters[key]}
                    </div>
                </div>)
        })}
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
  border: solid 1px #ff4d08;
  width: 240px;
  border-radius: 0;
  padding: 0.5rem;
  background-color: #fff;

  &.selected {
    border-color: #ff4d08;
  }
`