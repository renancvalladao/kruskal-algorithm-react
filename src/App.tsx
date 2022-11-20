import { useState } from "react";
import Typography from "@mui/material/Typography";
// @ts-ignore
import Graph from "react-graph-vis";
import GraphInput from "./GraphInput";

type Node = {
  id: number;
  label: string;
};

type Edge = {
  from: number;
  to: number;
  label: string;
};

const options = {
  layout: {
    hierarchical: false,
  },
  edges: {
    arrows: {
      to: { enabled: false },
    },
    color: "#000000",
  },
  height: "500px",
};

function App() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const readMatrix = (matrix: number[][]) => {
    const nodesArray: Node[] = [];
    const edgesArray: Edge[] = [];
    for (let i = 0; i < matrix.length; i++) {
      nodesArray.push({ id: i, label: i.toString() });
      for (let j = 0; j < i + 1; j++) {
        const weight = matrix[i][j];
        if (weight > 0) {
          edgesArray.push({ from: i, to: j, label: weight.toString() });
        }
      }
    }
    setNodes(nodesArray);
    setEdges(edgesArray);
  };

  return (
    <>
      <Typography align="center" variant="h2" gutterBottom>
        Kruskal Algorithm
      </Typography>
      {nodes.length === 0 ? (
        <GraphInput readMatrix={readMatrix} />
      ) : (
        <Graph graph={{ nodes, edges }} options={options} />
      )}
    </>
  );
}

export default App;
