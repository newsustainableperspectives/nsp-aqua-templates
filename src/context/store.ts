/* eslint-disable @typescript-eslint/no-explicit-any */
import { createStore } from '@xstate/store';
import { applyNodeChanges, NodeChange, Node, applyEdgeChanges, EdgeChange, Edge } from '@xyflow/react';

const store = createStore({
  // Initial context
  context: { 
    nodes: [] as Node<any, string>[],
    edges: [] as Edge[],
},
  // Transitions
  on: {
    onNodesChange: (context, event: { changes: NodeChange[] }) => ({
        nodes: applyNodeChanges(event.changes, context.nodes) as Node<any, string>[],
    }),
    onEdgesChange: (context, event: { changes: EdgeChange[] }) => ({
        edges: applyEdgeChanges(event.changes, context.edges) as Edge[],
    }),
  },
});

// Get the current state (snapshot)
console.log(store.getSnapshot());
// => {
//   status: 'active',
//   context: { count: 0, name: 'David' }
// }

// Subscribe to snapshot changes
store.subscribe((snapshot) => {
  console.log(snapshot.context);
});

// // Send an event
// store.send({ type: 'inc' });
// // logs { count: 1, name: 'David' }

// store.send({ type: 'add', num: 10 });
// // logs { count: 11, name: 'David' }

// store.send({ type: 'changeName', newName: 'Jenny' });
// // logs { count: 11, name: 'Jenny' }

export default store;