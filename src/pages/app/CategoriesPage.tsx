import HeaderCard from '@/components/accounts/HeaderCard';
import { resolveLucideIcon } from '@/components/accounts/lucideIcon';
import PickerGrid from '@/components/shared/PickerGrid';
import SelectorTab from '@/components/shared/SelectorTab';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import ScrollArea from '@/components/shared/ScrollArea';
import { useGetCategories } from '@/hooks/categories/useGetCategories';
import { Category } from '@/interfaces/Category';
import { TransactionType } from '@/interfaces/Transaction';
import { Text } from '@/shared/Text';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CategoriesPage() {
  const navigate = useNavigate();
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);

  const { data: allCategories = [], isLoading } = useGetCategories();
  const categories = allCategories.filter((c) => c.type === type);
  const sectionLabel = type === TransactionType.EXPENSE ? 'EXPENSE' : 'INCOME';
  const sectionColor = '#2f6b4f';

  const handleEdit = (cat: Category) => {
    navigate(`/main/categories/${cat.id}/edit?name=${encodeURIComponent(cat.name)}&icon=${cat.icon}&color=${encodeURIComponent(cat.color)}&type=${type}&mode=edit`);
  };

  const handleAdd = () => {
    navigate(`/main/categories/new?mode=add&type=${type}`);
  };

  return (
    <ScreenWrapper>
      <HeaderCard title="Categories" buttonText="New" onButtonPress={handleAdd} />

      <ScrollArea className="pb-8 pt-4 flex flex-col gap-6">
        <SelectorTab onTypeChange={(newType) => setType(newType)} />

        <div className="flex flex-row items-center mb-4 gap-2">
          <div className="w-1 h-4 rounded-sm shrink-0" style={{ backgroundColor: sectionColor }} />
          <Text variant="caption" className="font-bold text-muted-foreground uppercase tracking-wider flex-1">{sectionLabel}</Text>
          <div className="px-2 py-0.5 rounded-xl" style={{ backgroundColor: sectionColor + '20' }}>
            <Text variant="caption" className="font-bold" style={{ color: sectionColor }}>
              {categories.length}
            </Text>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!isLoading && (
          <PickerGrid itemSize={80} gap={12}>
            {categories.map((cat) => {
              const Icon = resolveLucideIcon(cat.icon);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleEdit(cat)}
                  className="bg-card rounded-lg flex flex-col items-center justify-center border border-border gap-2 shadow-sm p-3 cursor-pointer"
                  style={{ aspectRatio: '1' }}
                >
                  <div
                    className="rounded-full flex items-center justify-center"
                    style={{ width: '50%', height: '50%', backgroundColor: cat.color + '20' }}
                  >
                    <Icon size={20} color={cat.color} strokeWidth={1.8} />
                  </div>
                  <Text variant="caption" className="font-semibold text-foreground text-center line-clamp-2">
                    {cat.name}
                  </Text>
                </button>
              );
            })}
          </PickerGrid>
        )}
      </ScrollArea>
    </ScreenWrapper>
  );
}
