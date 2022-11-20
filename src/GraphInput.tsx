import { useState } from "react";
import { Button, TextField } from "@mui/material";

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
    <>
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
    </>
  );
};

export default GraphInput;
