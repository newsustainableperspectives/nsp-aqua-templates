import { BaseEdge, EdgeProps, getStraightPath } from '@xyflow/react';
 
function MindMapEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY } = props;
 
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY: sourceY + 17,
    targetX,
    targetY: targetY + 0,
  });
 
  return <BaseEdge path={edgePath} {...props} />;
}
 
export default MindMapEdge;