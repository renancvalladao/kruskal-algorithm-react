import { useState } from "react";
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
  id: number;
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
                      primary={`(${edge.from} - ${edge.to}) = ${edge.label}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Stack>
            <Button
              fullWidth
              variant="contained"
              color="success"
              sx={{ marginTop: 2 }}
              onClick={() => console.log("run")}
            >
              Run
            </Button>
          </>
        )}
      </Box>
    </>
  );
}

export default App;
