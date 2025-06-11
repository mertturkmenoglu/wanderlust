import React, { useState, type PropsWithChildren } from 'react';
import type { DateRange } from 'react-day-picker';

type DiaryContextState = {
  filterDateRange: DateRange | undefined;
  setFilterDateRange: React.Dispatch<
    React.SetStateAction<DateRange | undefined>
  >;
};

const DiaryContext = React.createContext<DiaryContextState>({
  filterDateRange: undefined,
  setFilterDateRange: () => {
    // do nothing
  },
});

function DiaryContextProvider({ children }: Readonly<PropsWithChildren>) {
  const [filterDateRange, setFilterDateRange] = useState<
    DateRange | undefined
  >();

  return (
    <DiaryContext.Provider
      value={{
        filterDateRange,
        setFilterDateRange,
      }}
    >
      {children}
    </DiaryContext.Provider>
  );
}

export { DiaryContext, DiaryContextProvider, type DiaryContextState };
