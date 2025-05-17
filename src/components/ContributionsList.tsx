
import React from 'react';
import { Contribution, ContributionType } from '@/types';
import { useFounders, useContributionWeights } from '@/context/AppContext';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow, parseISO } from 'date-fns';

interface ContributionsListProps {
  founderId: string;
  contributions: Contribution[];
}

const getContributionTypeLabel = (type: ContributionType): string => {
  switch (type) {
    case 'cash':
      return 'Cash Investment';
    case 'time':
      return 'Time Investment';
    case 'skills':
      return 'Skills / Resources';
    default:
      return 'Unknown';
  }
};

const getContributionAmountLabel = (type: ContributionType, amount: number): string => {
  switch (type) {
    case 'cash':
      return `$${amount.toLocaleString()}`;
    case 'time':
      return `${amount} hours`;
    case 'skills':
      return `${amount} points`;
    default:
      return amount.toString();
  }
};

const ContributionsList: React.FC<ContributionsListProps> = ({ founderId, contributions }) => {
  const { removeContribution } = useFounders();
  const { weights } = useContributionWeights();

  if (contributions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 text-center text-gray-500"
      >
        No contributions added yet
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full overflow-auto"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Weight</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>When</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contributions.map((contribution) => (
            <motion.tr
              key={contribution.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="border-b"
            >
              <TableCell className="font-medium">{getContributionTypeLabel(contribution.type)}</TableCell>
              <TableCell>{getContributionAmountLabel(contribution.type, contribution.amount)}</TableCell>
              <TableCell>×{weights[contribution.type].toFixed(1)}</TableCell>
              <TableCell>
                <span className="font-semibold">
                  {(contribution.amount * weights[contribution.type]).toFixed(1)}
                </span>
              </TableCell>
              <TableCell className="text-gray-500 text-xs">
                {formatDistanceToNow(parseISO(contribution.date), { addSuffix: true })}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeContribution(founderId, contribution.id)}
                  className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  Remove
                </Button>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
};

export default ContributionsList;
