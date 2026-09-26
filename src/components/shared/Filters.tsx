import { useGetCategories } from '@/hooks/categories/useGetCategories';
import { useCurrentTheme } from '@/hooks/useCurrentTheme';
import { useIconColors } from '@/hooks/useIconColors';
import { Category } from '@/interfaces/Category';
import { TransactionFilters, TransactionType } from '@/interfaces/Transaction';
import { toYMD } from '@/shared/dateRange';
import { Text } from '@/shared/Text';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import Card from './Card';
import FormActions from './FormActions';
import SelectField from './SelectField';

interface FilterValues {
  categoryId: number | null;
  type: TransactionType | null;
  dateStart: Date | null;
  dateEnd: Date | null;
  amountMin: string;
  amountMax: string;
}

const defaultValues: FilterValues = {
  categoryId: null,
  type: null,
  dateStart: null,
  dateEnd: null,
  amountMin: '',
  amountMax: '',
};

const toApiFilters = (v: FilterValues): TransactionFilters => {
  const min = v.amountMin ? parseInt(v.amountMin, 10) : NaN;
  const max = v.amountMax ? parseInt(v.amountMax, 10) : NaN;
  return {
    type: v.type ?? undefined,
    categoryId: v.categoryId ?? undefined,
    startDate: v.dateStart ? toYMD(v.dateStart) : undefined,
    endDate: v.dateEnd ? toYMD(v.dateEnd) : undefined,
    minAmount: Number.isFinite(min) ? min : undefined,
    maxAmount: Number.isFinite(max) ? max : undefined,
  };
};

interface FiltersProps {
  onApply?: (filters: TransactionFilters) => void;
}

export default function Filters({ onApply }: FiltersProps = {}) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<FilterValues>(defaultValues);
  const theme = useCurrentTheme();
  const accent = theme.colors.accent;
  const icon = useIconColors();
  const { data: categories } = useGetCategories();

  const update = <K extends keyof FilterValues>(key: K, v: FilterValues[K]) =>
    setValues((p) => ({ ...p, [key]: v }));

  const clearAll = () => {
    setValues(defaultValues);
    onApply?.({});
  };

  const apply = () => {
    onApply?.(toApiFilters(values));
    setOpen(false);
  };

  const selectedCategory = useMemo<Category | null>(() => {
    const all = (categories as Category[] | undefined) ?? [];
    return all.find((c) => c.id === values.categoryId) ?? null;
  }, [categories, values.categoryId]);

  useEffect(() => {
    if (
      values.type &&
      selectedCategory &&
      selectedCategory.type !== values.type
    ) {
      update('categoryId', null);
    }
  }, [values.type, selectedCategory]);

  const categoryOptions = useMemo<Category[]>(() => {
    const all = (categories as Category[] | undefined) ?? [];
    if (!values.type) return all;
    return all.filter(
      (c) => c.type === values.type,
    );
  }, [categories, values.type]);

  const Chevron = open ? ChevronUp : ChevronDown;

  const summary = [
    selectedCategory ? selectedCategory.name : 'All categories',
    values.type
      ? values.type === 'expense' ? 'Expense' : 'Income'
      : 'All types',
  ].join(' · ');

  return (
    <Card className="overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex flex-row items-center gap-3 px-4 py-3 w-full text-left border-0 bg-transparent cursor-pointer"
      >
        <div className="w-10 h-10 rounded-xl bg-accent-subtle flex items-center justify-center flex-shrink-0">
          <Filter size={18} color={accent} />
        </div>
        <div className="flex-1 min-w-0">
          <Text variant="h3" className="text-foreground">
            {open ? 'Filters' : 'Filters collapsed'}
          </Text>
          <Text variant="caption" className="text-foreground truncate block">
            {open ? 'Refine transactions by category, type, date, amount' : summary}
          </Text>
        </div>
        <Chevron size={20} color={icon.subtle} />
      </button>

      {open && (
        <div className="px-4 pb-4 pt-4 flex flex-col gap-5 border-t border-border">
          {/* Type */}
          <div>
            <Text variant="label" className="font-semibold text-foreground mb-2">
              Type
            </Text>
            <div className="flex flex-row gap-2">
              {(['expense', 'income'] as const).map((t) => {
                const selected = values.type === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => update('type', selected ? null : t)}
                    className={`flex-1 py-3 rounded-lg flex items-center justify-center border-0 cursor-pointer ${selected ? 'bg-accent-subtle' : 'bg-muted'}`}
                  >
                    <Text
                      variant="label"
                      className={`font-semibold ${selected ? 'text-accent' : 'text-muted-foreground'}`}
                    >
                      {t === 'expense' ? 'Expense' : 'Income'}
                    </Text>
                  </button>
                );
              })}
            </div>
          </div>

          {values.type && (
            <SelectField<Category>
              label="Category"
              placeholder="Select a category"
              options={categoryOptions}
              value={selectedCategory}
              onChange={(item) => update('categoryId', item?.id ?? null)}
            />
          )}

          {/* Date range */}
          <div>
            <Text variant="label" className="font-semibold text-foreground mb-2">
              Date range
            </Text>
            <div className="flex flex-row gap-2">
              <input
                type="date"
                value={values.dateStart ? toYMD(values.dateStart) : ''}
                onChange={(e) => {
                  const d = new Date(e.target.value + 'T00:00:00');
                  if (!isNaN(d.getTime())) update('dateStart', d);
                }}
                className="flex-1 border border-border rounded-lg px-3 py-2 bg-transparent outline-none text-foreground text-body"
                placeholder="Start date"
              />
              <input
                type="date"
                value={values.dateEnd ? toYMD(values.dateEnd) : ''}
                onChange={(e) => {
                  const d = new Date(e.target.value + 'T00:00:00');
                  if (!isNaN(d.getTime())) update('dateEnd', d);
                }}
                className="flex-1 border border-border rounded-lg px-3 py-2 bg-transparent outline-none text-foreground text-body"
                placeholder="End date"
              />
            </div>
          </div>

          {/* Amount range */}
          <div>
            <Text variant="label" className="font-semibold text-foreground mb-2">
              Amount range
            </Text>
            <div className="flex flex-row gap-2">
              <div className="flex-1 px-3 py-2 rounded-lg bg-background-wash border border-border">
                <Text variant="caption" className="text-muted-foreground mb-0.5">
                  Min amount
                </Text>
                <input
                  value={values.amountMin}
                  onChange={(e) => update('amountMin', e.target.value)}
                  placeholder="$0.00"
                  type="number"
                  min="0"
                  className="border-0 bg-transparent outline-none text-foreground text-body font-bold w-full"
                />
              </div>
              <div className="flex-1 px-3 py-2 rounded-lg bg-background-wash border border-border">
                <Text variant="caption" className="text-muted-foreground mb-0.5">
                  Max amount
                </Text>
                <input
                  value={values.amountMax}
                  onChange={(e) => update('amountMax', e.target.value)}
                  placeholder="$500.00"
                  type="number"
                  min="0"
                  className="border-0 bg-transparent outline-none text-foreground text-body font-bold w-full"
                />
              </div>
            </div>
          </div>

          <FormActions
            onCancel={clearAll}
            onSave={apply}
            cancelLabel="Clear filters"
            saveLabel="Apply"
          />
        </div>
      )}
    </Card>
  );
}
