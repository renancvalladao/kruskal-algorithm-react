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

type DisjointSet = {
  label: string;
  parent: string;
  size: number;
};

type DisjointSetObject = {
  [key: string]: DisjointSet;
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

const sortEdges = (edgesToBeSorted: Edge[]): Edge[] => {
  if (edgesToBeSorted.length <= 1) return edgesToBeSorted;
  const midPosition = Math.floor(edgesToBeSorted.length / 2);
  const left = sortEdges(edgesToBeSorted.slice(0, midPosition));
  const right = sortEdges(edgesToBeSorted.slice(midPosition));
  return merge(left, right);
};

const merge = (leftArray: Edge[], rightArray: Edge[]): Edge[] => {
  const resultArray: Edge[] = [];
  while (leftArray.length > 0 && rightArray.length > 0) {
    let edge: Edge;
    if (leftArray[0].weight < rightArray[0].weight) {
      edge = leftArray[0];
      leftArray.shift();
    } else {
      edge = rightArray[0];
      rightArray.shift();
    }
    resultArray.push(edge);
  }
  if (leftArray.length > 0) {
    resultArray.push(...leftArray);
  }
  if (rightArray.length > 0) {
    resultArray.push(...rightArray);
  }

  return resultArray;
};

const root = (disjointSet: DisjointSet, sets: DisjointSetObject): string => {
  while (disjointSet.parent !== disjointSet.label) {
    disjointSet = sets[disjointSet.parent];
  }

  return disjointSet.label;
};

function App() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [chosenEdges, setChosenEdges] = useState<Edge[]>([]);
  const [disjointSets, setDisjointSets] = useState<DisjointSetObject>({});
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [counter, setCounter] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (running) {
      timer = setTimeout(() => {
        if (counter < edges.length) {
          const sets: DisjointSetObject = JSON.parse(
            JSON.stringify(disjointSets)
          );
          const localEdges: Edge[] = JSON.parse(JSON.stringify(edges));
          const edge = localEdges[counter];
          const from = edge.from;
          const to = edge.to;
          const fromRoot = root(sets[`${from}`], sets);
          const toRoot = root(sets[`${to}`], sets);
          // Checking if they belong to the same set or not (no cycles)
          if (fromRoot !== toRoot) {
            edge.color = "green";
            // Choosing edge
            setChosenEdges((prevEdges) => [...prevEdges, edge]);
            // Union considering the set size
            if (sets[fromRoot].size < sets[toRoot].size) {
              sets[fromRoot].parent = sets[toRoot].label;
              sets[toRoot].size += sets[fromRoot].size;
            } else {
              sets[toRoot].parent = sets[fromRoot].label;
              sets[fromRoot].size += sets[toRoot].size;
            }
          } else {
            // Discarding edge
            edge.color = "red";
          }
          setEdges(localEdges);
          setDisjointSets(sets);
          setStatus(`Analyzing (${edge.from} - ${edge.to})...`);
          setCounter((prevCounter) => prevCounter + 1);
        } else {
          setRunning(false);
          setFinished(true);
        }
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [running, edges, chosenEdges, counter, disjointSets]);

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

  const initializeSets = (nodes: Node[]): DisjointSetObject => {
    const disjointSet: DisjointSetObject = {};
    for (let i = 0; i < nodes.length; i++) {
      const set: DisjointSet = {
        label: nodes[i].label,
        parent: nodes[i].label,
        size: 1,
      };
      disjointSet[set.label] = set;
    }
    return disjointSet;
  };

  const initKruskal = () => {
    setStatus("Sorting edges...");
    const sortedEdges = sortEdges([...edges]);
    const sets: DisjointSetObject = initializeSets([...nodes]);
    setRunning(true);
    setDisjointSets(sets);
    setEdges([...sortedEdges]);
  };

  let solutionWeight = 0;
  chosenEdges.forEach((edge: Edge) => {
    solutionWeight += edge.weight;
  });

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
                  maxHeight: 500,
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
                onClick={() => initKruskal()}
              >
                Run
              </Button>
            )}
            {running && (
              <Typography align="center" variant="h6" gutterBottom>
                {status}
              </Typography>
            )}
            {finished && (
              <>
                <Typography align="center" variant="h6" gutterBottom>
                  {`Solution (weight:${solutionWeight})`}
                </Typography>
                <Graph
                  graph={{ nodes, edges: chosenEdges }}
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
