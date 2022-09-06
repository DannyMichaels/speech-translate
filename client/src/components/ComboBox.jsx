import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export default function ComboBox({
  options,
  onChange,
  label = 'language',
  value,
  renderOption,
}) {
  return (
    <Autocomplete
      onChange={onChange}
      disablePortal
      value={options.find((opt) => opt.value === value)}
      autoSelect={true}
      options={options}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label={label} />}
      renderOption={renderOption}
    />
  );
}
