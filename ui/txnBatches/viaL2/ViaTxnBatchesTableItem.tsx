import { Text } from '@chakra-ui/react';
import React from 'react';

import type { ViaBatchesItem } from 'types/api/viaL2';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import { Link } from 'toolkit/chakra/link';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import BatchEntityL2 from 'ui/shared/entities/block/BatchEntityL2';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import ViaL2TxnBatchStatus from 'ui/shared/statusTag/ViaL2TxnBatchStatus';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

const rollupFeature = config.features.rollup;

type Props = { item: ViaBatchesItem; isLoading?: boolean };

const ViaTxnBatchesTableItem = ({ item, isLoading }: Props) => {
  if (!rollupFeature.isEnabled || rollupFeature.type !== 'via' || item.number === 0) {
    return null;
  }

  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        <BatchEntityL2
          isLoading={ isLoading }
          number={ item.number }
          textStyle="sm"
          fontWeight={ 600 }
          noIcon
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <ViaL2TxnBatchStatus status={ item.status } isLoading={ isLoading }/>
      </TableCell>
      <TableCell verticalAlign="middle">
        <TimeAgoWithTooltip
          timestamp={ item.timestamp }
          fallbackText="Undefined"
          isLoading={ isLoading }
          color="text.secondary"
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <Link
          href={ route({ pathname: '/batches/[number]', query: { number: item.number.toString(), tab: 'txs' } }) }
          loading={ isLoading }
          minW="40px"
          my={ 1 }
        >
          { item.transactions_count }
        </Link>
      </TableCell>
      <TableCell verticalAlign="middle">
        { item.commit_transaction_hash ? (
          <TxEntityL1
            isLoading={ isLoading }
            hash={ item.commit_transaction_hash.replace('0x', '') }
            textStyle="sm"
            truncation="constant_long"
            noIcon
          />
        ) : <Text>Pending</Text> }
      </TableCell>
      <TableCell verticalAlign="middle">
        { item.prove_transaction_hash ? (
          <TxEntityL1
            isLoading={ isLoading }
            hash={ item.prove_transaction_hash.replace('0x', '') }
            textStyle="sm"
            truncation="constant_long"
            noIcon
          />
        ) : <Text>Pending</Text> }
      </TableCell>
    </TableRow>
  );
};

export default ViaTxnBatchesTableItem;
