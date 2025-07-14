import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    type SelectChangeEvent,
} from "@mui/material";
import { useEffect } from "react";

export type SelectSeasonProps = {
    /**
     * requires you to have usestate hook in parent component
     * example const [selectedYear, updateSeason] = useState('')
     * leave value as empty string if you want current year, by default or have no year selection
     * optional props are props related with the styling of the drop down
     */
    updateSeason: (season: string) => void;
    selectedYear: string; //if no year selection needed
    label_name?: string;
    width?: number;
    disabled?: boolean;
};
export default function SelectSeasonDropDown({
    updateSeason,
    selectedYear,
    label_name,
    width,
    disabled,
}: SelectSeasonProps) {
    /**
     * @returns drop down menu with years ranging from 2017(year sleeper was launched) to current year
     * updateSeason will update the usestate value parent component
     * selected year is the year that will be displayed, aslo from parent component
     */
    const currentDate: Date = new Date();
    const currentYear = currentDate.getFullYear();
    const validYears = Array.from(
        { length: currentYear - 2017 + 1 },
        (_, i) => i + 2017
    ).reverse();

    const handleSeasonChange = (event: SelectChangeEvent) => {
        //update season for component that called it
        updateSeason(event.target.value);
    };
    useEffect(() => {
        updateSeason(selectedYear ? selectedYear : String(currentYear));
    }, [selectedYear]);
    return (
        <FormControl fullWidth disabled={disabled}>
            <InputLabel id="select-season-input-label">{label_name}</InputLabel>
            <Select
                labelId="select-season-input-label"
                value={selectedYear}
                label={label_name}
                onChange={handleSeasonChange}
                sx={{ ...(width && { minWidth: width }) }}
                MenuProps={{
                    PaperProps: {
                        style: {
                            maxHeight: 48 * 4 + 8, // 4 items visible at a time
                            //48 is default height if menu item in MUI
                            //"+8 is for padding"
                            //maxHeight = default height for menu item * number of items to show + padding
                        },
                    },
                }}
            >
                {validYears.map((year) => {
                    return (
                        <MenuItem key={year} value={year}>
                            {year}
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );
}
