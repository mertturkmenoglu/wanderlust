import type { PropsWithChildren } from 'react';
import React, { useState } from 'react';
import type { DateRange } from 'react-day-picker';

export type DiaryContextState = {
  filterDateRange: DateRange | undefined;
  setFilterDateRange: React.Dispatch<
    React.SetStateAction<DateRange | undefined>
  >;
};

export const DiaryContext = React.createContext<DiaryContextState>({
  filterDateRange: undefined,
  setFilterDateRange: () => {},
});

export default function DiaryContextProvider({
  children,
}: Readonly<PropsWithChildren>) {
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
