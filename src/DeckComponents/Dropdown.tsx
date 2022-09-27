import { v4 as uuidv4 } from "uuid";

export default function Dropdown(props: {
  keys: string;
  cardFilter: any;
  handleClick: (option: string, restore?: string[]) => void;
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <>
      <b>
        {props.keys.substring(0, 1).toLocaleUpperCase() +
          props.keys.substring(1)}
      </b>
      <select>
       {/* <option
          onClick={() => {
            props.handleClick("clear", props.cardFilter[props.keys]);
          }}
        >
          clear
          {" " +
            props.keys.substring(0, 1).toLocaleUpperCase() +
            props.keys.substring(1)}
        </option>*/}
        {props.cardFilter[props.keys].map((item: any) => (
          <option
            key={uuidv4()}
            value={item}
            onClick={() => {
              props.handleClick(item);
              props.setIsFilterOpen(false)
            }}
          >
            {item}
          </option>
        ))}
      </select>
    </>
  );
}
