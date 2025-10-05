"use client";

import { useQueryClient, useIsFetching } from "@tanstack/react-query";
import { useCallback } from "react";

export const useGlobalRefresh = () => {
  const queryClient = useQueryClient();
  const isFetching = useIsFetching();

  const refreshAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["usdc-events"] });
    queryClient.invalidateQueries({ queryKey: ["transactions"] });

    queryClient.invalidateQueries({
      predicate: (query) => {
        const queryKey = query.queryKey;
        return (
          Array.isArray(queryKey) &&
          queryKey.length > 0 &&
          typeof queryKey[0] === "object" &&
          queryKey[0] !== null &&
          "address" in queryKey[0] &&
          "functionName" in queryKey[0] &&
          queryKey[0].functionName === "balanceOf"
        );
      },
    });
  }, [queryClient]);

  return {
    refreshAll,
    isRefreshing: isFetching > 0,
  };
};
