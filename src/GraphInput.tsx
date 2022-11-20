import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

type Props = {
  readMatrix: (matrix: number[][]) => void;
};

const GraphInput = ({ readMatrix }: Props) => {
  const [input, setInput] = useState("[0, 1, 1]\n[1, 0, 1]\n[1, 1, 0]");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const parseInput = (matrixInput: string) => {
    const stringMatrix = matrixInput.split("\n");
    const matrix: number[][] = [];
    stringMatrix.forEach((row: string) => {
      const rowStrings = row.slice(1, -1).split(",");
      const rowValues = rowStrings.map((rowString: string) =>
        parseInt(rowString)
      );
      matrix.push(rowValues);
    });
    readMatrix(matrix);
  };

  return (
    <Box
      component="form"
      sx={{
        m: 2,
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        id="outlined-multiline-flexible"
        label="Matrix Input"
        multiline
        value={input}
        onChange={handleChange}
        fullWidth
      />
      <Button
        fullWidth
        variant="contained"
        color="success"
        sx={{ marginTop: 2 }}
        onClick={() => parseInput(input)}
      >
        Parse
      </Button>
    </Box>
  );
};

export default GraphInput;
