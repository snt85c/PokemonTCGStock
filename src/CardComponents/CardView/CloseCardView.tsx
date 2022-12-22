import { AiFillCloseCircle } from "react-icons/ai";

export default function CloseCardView(props:{setIsCardView: React.Dispatch<React.SetStateAction<boolean>>}){
    return (<>
      <div className="tooltip tooltip-left" data-tip={"close card view"}>

     <AiFillCloseCircle size={50}
        className=" text-gray-500 hover:text-white duration-300"
        onClick={(e) => {
          e.preventDefault()
          props.setIsCardView(false);
        }}
      />
      </div></>)
}