import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import type { Place } from './types';
import { computeRating } from '@/lib/rating';

type State = {
  place: Place;
  rating: string;
  index: number;
  setIndex: Dispatch<SetStateAction<number>>;
  asset: Place['assets'][number];
};

export const PlaceCardContext = createContext<State | null>(null);

type Props = React.PropsWithChildren & {
  place: Place;
};

export function PlaceCardContextProvider({ children, place }: Props) {
  const [index, setIndex] = useState(0);
  const el = place.assets[index];
  const rating = computeRating(place.totalPoints, place.totalVotes);

  if (!el) {
    return null;
  }

  return (
    <PlaceCardContext.Provider
      value={{
        place,
        asset: el,
        index,
        setIndex,
        rating,
      }}
    >
      {children}
    </PlaceCardContext.Provider>
  );
}

export function usePlaceCardContext() {
  const context = useContext(PlaceCardContext);

  if (!context) {
    throw new Error(
      'usePlaceCardContext must be used within a PlaceCardContextProvider',
    );
  }

  return context;
}
