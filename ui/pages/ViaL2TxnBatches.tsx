import { Box, Text } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { generateListStub } from 'stubs/utils';
import { VIA_L2_TXN_BATCHES_ITEM } from 'stubs/viaL2';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import StickyPaginationWithText from 'ui/shared/StickyPaginationWithText';
import ViaTxnBatchesListItem from 'ui/txnBatches/viaL2/ViaTxnBatchesListItem';
import ViaTxnBatchesTable from 'ui/txnBatches/viaL2/ViaTxnBatchesTable';

const ViaL2TxnBatches = () => {
  const { data, isError, isPlaceholderData, pagination } = useQueryWithPages({
    resourceName: 'general:via_l2_txn_batches',
    options: {
      placeholderData: generateListStub<'general:via_l2_txn_batches'>(
        VIA_L2_TXN_BATCHES_ITEM,
        50,
        {
          next_page_params: {
            items_count: 50,
            number: 9045200,
          },
        },
      ),
    },
  });

  const countersQuery = useApiQuery('general:via_l2_txn_batches_count', {
    queryOptions: {
      placeholderData: 5231746,
    },
  });

  const content = data?.items ? (
    <>
      <Box hideFrom="lg">
        { data.items.map(((item, index) => (
          <ViaTxnBatchesListItem
            key={ item.number + (isPlaceholderData ? String(index) : '') }
            item={ item }
            isLoading={ isPlaceholderData }
          />
        ))) }
      </Box>
      <Box hideBelow="lg">
        <ViaTxnBatchesTable items={ data.items } top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 } isLoading={ isPlaceholderData }/>
      </Box>
    </>
  ) : null;

  const text = (() => {
    if (countersQuery.isError || isError || !data?.items.length) {
      return null;
    }

    return (
      <Skeleton loading={ countersQuery.isPlaceholderData || isPlaceholderData } display="flex" flexWrap="wrap">
        Txn batch
        <Text fontWeight={ 600 } whiteSpace="pre"> #{ data.items[0].number } </Text>to
        <Text fontWeight={ 600 } whiteSpace="pre"> #{ data.items[data.items.length - 1].number } </Text>
        (total of { countersQuery.data?.toLocaleString() } batches)
      </Skeleton>
    );
  })();

  const actionBar = <StickyPaginationWithText text={ text } pagination={ pagination }/>;

  return (
    <>
      <PageTitle title="Txn batches" withTextAd/>
      <DataListDisplay
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText="There are no txn batches."
        actionBar={ actionBar }
      >
        { content }
      </DataListDisplay>
    </>
  );
};

export default ViaL2TxnBatches;
