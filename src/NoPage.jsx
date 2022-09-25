import { useNavigate } from "react-router";

export default function NoPage() {
  const navigate = useNavigate();
  return (
    <div>
      <button
      className="px-2 rounded border-black border-2 bg-white m-2"
        onClick={() => {
          navigate("");
        }}
      >
        back
      </button>
    </div>
  );
}
