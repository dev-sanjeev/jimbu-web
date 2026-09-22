import { TransactionType } from '@/interfaces/components/ITransaction';
import { useState } from 'react';
import Selector from './Selector';

interface ISelectorTabProps {
  onTypeChange: (type: TransactionType) => void;
}

export default function SelectorTab({ onTypeChange }: ISelectorTabProps) {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    onTypeChange(newType);
  };

  return (
    <div className="mb-5">
      <div className="flex flex-row bg-card rounded-lg p-1">
        <Selector
          label="Expense"
          transactionType={TransactionType.EXPENSE}
          activeType={type}
          onPress={() => handleTypeChange(TransactionType.EXPENSE)}
        />
        <Selector
          label="Income"
          transactionType={TransactionType.INCOME}
          activeType={type}
          onPress={() => handleTypeChange(TransactionType.INCOME)}
        />
      </div>
    </div>
  );
}
