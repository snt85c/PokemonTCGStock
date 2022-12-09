import useCollectionStore from "../CollectionComponent/useCollectionStore";
import { iCollectionStore } from "../Interfaces";

export default function useCalculateCardGroupValueAsNumber(
  groupcardID: string
) {
  const userDeck = useCollectionStore(
    (state: iCollectionStore) => state.currentDeck
  );
  let value = 0
  if (groupcardID) {
    value =  userDeck
      .filter((card) => card.id === groupcardID)
      .map((card) => card.userDeckInfo.value)
      .reduce((a, b) => a + b, 0);
  }
  return value
}
