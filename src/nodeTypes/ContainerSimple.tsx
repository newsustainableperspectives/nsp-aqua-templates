/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { memo } from 'react';
import { Handle, NodeProps, NodeResizer, Position } from '@xyflow/react'
import styled from 'styled-components'
import {GripVertical} from 'lucide-react'

export default memo(({ id, data, isConnectable }: NodeProps) => {
  return (
    <StyledNode>
      <div className="flex">
      </div>
    </StyledNode>
  );
});


const StyledNode = styled.div`

`