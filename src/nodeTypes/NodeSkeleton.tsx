/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { memo } from 'react';
import { Handle, NodeProps, NodeResizer, Position } from '@xyflow/react'
import styled from 'styled-components'

export default memo(({ id, data, isConnectable }: NodeProps) => {
  // console.log('data', id, data)
  return (
    <StyledNode>
      {/* <NodeResizer minWidth={100} minHeight={30} onResizeEnd={(event, params) => console.log('resize', params)} /> */}
      <div className="flex">
        {data.child}
      </div>
    </StyledNode>
  );
});


const StyledNode = styled.div`
  padding: 5px;
`