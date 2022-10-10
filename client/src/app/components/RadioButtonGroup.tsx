import { FormControl, RadioGroup, FormControlLabel, Radio } from "@mui/material";

interface Props {
  options: any[];
  onChange: (e: any) => void;
  selectedValue: string;
}

const RadioButtonGroup: React.FC<Props> = ({ options, onChange, selectedValue }) => {
  return (
    <FormControl>
      <RadioGroup onChange={onChange} value={selectedValue}>
        {options.map(({ value, label }) => (
          <FormControlLabel value={value} control={<Radio />} label={label} key={value} />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default RadioButtonGroup;
