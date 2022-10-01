import useCollectionStore from "../CollectionComponent/useCollectionStore";
import { iCollectionStore } from "../Interfaces";

export default function Home() {
  const calculateUserDecksTotalValue = useCollectionStore(
    (state: iCollectionStore) => state.calculateUserDecksTotalValue
  );

  const total = calculateUserDecksTotalValue()
  return (
    <div className="flex flex-col justify-start items-center  h-screen bg-slate-500">
      <h1 className="m-5">Homepage</h1>
      <div>{ total}</div>
    </div>
  );
}
