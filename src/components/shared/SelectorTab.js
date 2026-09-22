import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TransactionType } from '@/interfaces/components/ITransaction';
import { useState } from 'react';
import Selector from './Selector';
export default function SelectorTab({ onTypeChange }) {
    const [type, setType] = useState(TransactionType.EXPENSE);
    const handleTypeChange = (newType) => {
        setType(newType);
        onTypeChange(newType);
    };
    return (_jsx("div", { className: "mb-5", children: _jsxs("div", { className: "flex flex-row bg-card rounded-lg p-1", children: [_jsx(Selector, { label: "Expense", transactionType: TransactionType.EXPENSE, activeType: type, onPress: () => handleTypeChange(TransactionType.EXPENSE) }), _jsx(Selector, { label: "Income", transactionType: TransactionType.INCOME, activeType: type, onPress: () => handleTypeChange(TransactionType.INCOME) })] }) }));
}
