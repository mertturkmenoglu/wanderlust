import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import type { Poi } from './types';
import { computeRating } from '@/lib/rating';

type State = {
  poi: Poi;
  rating: string;
  index: number;
  setIndex: Dispatch<SetStateAction<number>>;
  image: Poi['images'][number];
};

export const PoiCardContext = createContext<State | null>(null);

type Props = React.PropsWithChildren & {
  poi: Poi;
};

export function PoiCardContextProvider({ children, poi }: Props) {
  const [index, setIndex] = useState(0);
  const el = poi.images[index];
  const rating = computeRating(poi.totalPoints, poi.totalVotes);

  if (!el) {
    return null;
  }

  return (
    <PoiCardContext.Provider
      value={{
        poi,
        image: el,
        index,
        setIndex,
        rating,
      }}
    >
      {children}
    </PoiCardContext.Provider>
  );
}

export function usePoiCardContext() {
  const context = useContext(PoiCardContext);

  if (!context) {
    throw new Error(
      'usePoiCardContext must be used within a PoiCardContextProvider',
    );
  }

  return context;
}
