import { useNavigate } from "react-router"

export default function Menu(){
const navigate = useNavigate()
return (<div className="fixed flex justify-evenly items-center bottom-0 h-1/6 bg-slate-800 w-full text-white">
        <button onClick={()=>{navigate("/")}}>HOME</button>
        <button onClick={()=>{navigate("/search")}}>SEARCH</button>
        <button onClick={()=>{navigate("/collection")}}>COLLECTION</button>
        <button onClick={()=>{navigate("/user")}}>PROFILE</button>

    </div>)
}