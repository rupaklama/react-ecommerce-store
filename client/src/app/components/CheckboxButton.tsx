import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import React, { useState } from "react";

interface Props {
  items: string[];
  checked?: string[];
  onChange: (item: string[]) => void;
}

const CheckboxButton: React.FC<Props> = ({ items, checked, onChange }) => {
  // console.log(items, checked, onChange);

  // productParams.brands
  const [checkedItems, setCheckedItems] = useState(checked || []);
 

  // verifying item is checked or not
  const handleChecked = (value: string) => {
    const currentIndex = checkedItems.findIndex(item => item === value);
    // console.log(currentIndex);

    let newChecked: string[] = [];

    // add check item
    if (currentIndex === -1) newChecked = [...checkedItems, value];
    // remove check item
    else newChecked = checkedItems.filter(item => item !== value);

    setCheckedItems(newChecked);

    // returning array to dispatch
    onChange(newChecked);
  };

  return (
    <FormGroup>
      {items.map(item => (
        <FormControlLabel
          control={<Checkbox checked={checkedItems.indexOf(item) !== -1} onClick={() => handleChecked(item)} />}
          label={item}
          key={item}
        />
      ))}
    </FormGroup>
  );
};

export default CheckboxButton;
