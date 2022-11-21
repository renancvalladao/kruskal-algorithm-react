import { useState, useEffect } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Stack,
} from "@mui/material";
// @ts-ignore
import Graph from "react-graph-vis";
import GraphInput from "./GraphInput";

type Node = {
  id: string;
  label: string;
};

type Edge = {
  from: number;
  to: number;
  weight: number;
  label: string;
  color: string;
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

const sortEdges = (edgesToBeSorted: Edge[]) => {
  return edgesToBeSorted.sort((firstEdge: Edge, secondEdge: Edge): number => {
    if (firstEdge.weight < secondEdge.weight) return -1;
    if (firstEdge.weight > secondEdge.weight) return 1;
    return 0;
  });
};

function App() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [visitedEdges, setVisitedEdges] = useState<Edge[]>([]);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (running) {
      timer = setTimeout(() => {
        if (counter < edges.length) {
          const edge = edges[visitedEdges.length];
          edge.color = "red";
          if (visitedEdges.length < 2) {
            setVisitedEdges((prevEdges) => [...prevEdges, edge]);
          }
          setCounter((prevCounter) => prevCounter + 1);
        } else {
          setRunning(false);
          setFinished(true);
        }
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [running, edges, visitedEdges, counter]);

  const readMatrix = (matrix: number[][]) => {
    const nodesArray: Node[] = [];
    const edgesArray: Edge[] = [];
    for (let i = 0; i < matrix.length; i++) {
      nodesArray.push({ id: i.toString(), label: i.toString() });
      for (let j = 0; j < i + 1; j++) {
        const weight = matrix[i][j];
        if (weight > 0) {
          edgesArray.push({
            from: i,
            to: j,
            weight: weight,
            label: weight.toString(),
            color: "black",
          });
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
      <Box
        component="form"
        sx={{
          m: 2,
        }}
        noValidate
        autoComplete="off"
      >
        {nodes.length === 0 ? (
          <GraphInput readMatrix={readMatrix} />
        ) : (
          <>
            <Stack direction="row">
              <Graph graph={{ nodes, edges }} options={options} />
              <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background",
                  position: "relative",
                  overflow: "auto",
                  maxHeight: 300,
                  "& ul": { padding: 0 },
                }}
                subheader={<li />}
              >
                <Typography variant="h5" gutterBottom>
                  Edges
                </Typography>
                {edges.map((edge) => (
                  <ListItem
                    disableGutters
                    key={`item-${edge.from}-${edge.to}-${edge.label}`}
                  >
                    <ListItemText
                      sx={{ color: edge.color }}
                      primary={`(${edge.from} - ${edge.to}) = ${edge.label}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Stack>
            {!(running || finished) && (
              <Button
                fullWidth
                variant="contained"
                color="success"
                sx={{ marginTop: 2 }}
                onClick={() => {
                  setRunning(true);
                  const sortedEdges = sortEdges([...edges]);
                  setEdges([...sortedEdges]);
                }}
              >
                Run
              </Button>
            )}
            {finished && (
              <>
                <Typography align="center" variant="h6" gutterBottom>
                  Solution
                </Typography>
                <Graph
                  graph={{ nodes, edges: visitedEdges }}
                  options={options}
                />
              </>
            )}
          </>
        )}
      </Box>
    </>
  );
}

export default App;
