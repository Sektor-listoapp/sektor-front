/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { QUOTES_QUERY } from "@/lib/sektor-api/queries";
import QuotesTable from "./table";
import QuotesAccordion from "./accordion";
import QuotesHeader from "./header";
import SektorFullVerticalLogo from "../icons/sektor-full-vertical-logo";
import { useAuthStore } from "@/store/auth";
import { Query, QuoteType } from "@/lib/sektor-api/__generated__/types";
import NoQuotes from "./no-quotes";

const QuoteList = () => {
  const userId = useAuthStore((state) => state.user?.id);
  const [quotes, setQuotes] = useState<QuoteType[]>([]);
  const [isLoadingQuotes, setIsLoadingQuotes] = useState(false);

  const defaultVariables = {
    organizationId: userId,
    pagination: { offset: 0, limit: 10000 },
  };
  const { error: quotesError, refetch: getQuotes } = useQuery<Query>(
    QUOTES_QUERY,
    { fetchPolicy: "no-cache", nextFetchPolicy: "no-cache" }
  );

  const disableActions = isLoadingQuotes;

  const handleGetQuotes = (variables?) => {
    setIsLoadingQuotes(true);
    const hasVariables = Boolean(variables?.filter);
    const queryVariables = hasVariables ? variables : defaultVariables;
    getQuotes(queryVariables)
      .then((res) => setQuotes(res?.data?.quotes?.items || []))
      .catch((e) => console.log(e))
      .finally(() => setIsLoadingQuotes(false));
  };

  useEffect(() => handleGetQuotes(), []);

  if (quotesError) {
    return <NoQuotes quotesError={true} />;
  }

  return (
    <section className="bg-white w-full py-5 md:py-10 flex flex-col items-center justify-center gap-10 xl:shadow-2xl rounded-xl xl:px-10">
      <QuotesHeader
        handleGetQuotes={handleGetQuotes}
        disabled={isLoadingQuotes}
      />

      {isLoadingQuotes && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-40 z-50">
          <SektorFullVerticalLogo className="w-32 animate-pulse" />
        </div>
      )}

      {!quotes?.length && !isLoadingQuotes ? (
        <NoQuotes />
      ) : (
        <>
          <QuotesTable data={quotes} disabled={disableActions} />
          <QuotesAccordion data={quotes} disabled={disableActions} />
        </>
      )}
    </section>
  );
};

export default QuoteList;
