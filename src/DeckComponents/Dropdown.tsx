import { v4 as uuidv4 } from "uuid";

export default function Dropdown(props: {
  keys: string;
  cardFilter: any;
  handleClick: (option: string, restore?: string[]) => void;
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  let result = props.cardFilter[props.keys].map((item: any) => (
    <option key={uuidv4()} value={item}>
      {item}
    </option>
  ));
  result.push(
    <option  key={uuidv4()} value="-1" disabled style={{ display: "none" }}></option>
  );


  return (
    <>
      <b>
        {props.keys.substring(0, 1).toLocaleUpperCase() +
          props.keys.substring(1)}
      </b>
      <select
        defaultValue={"-1"}
        onChange={(event) => {
          props.handleClick(event.target.value);
          props.setIsFilterOpen(false);
        }}
      >
        {result}
      </select>
    </>
  );
}
