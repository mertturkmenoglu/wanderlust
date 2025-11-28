import type { SetStateAction } from 'jotai';
import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type PropsWithChildren,
} from 'react';

type State = {
  index: number;
  setIndex: Dispatch<SetStateAction<number>>;
};

export const BookmarksContext = createContext<State | null>(null);

export function BookmarksContextProvider({ children }: PropsWithChildren) {
  const [index, setIndex] = useState(0);

  return (
    <BookmarksContext.Provider value={{ index, setIndex }}>
      {children}
    </BookmarksContext.Provider>
  );
}

export function useBookmarksContext() {
  const context = useContext(BookmarksContext);

  if (!context) {
    throw new Error(
      'useBookmarksContext must be used within a BookmarksContextProvider',
    );
  }

  return context;
}
