interface IPickerGrid {
  itemSize?: number;
  gap?: number;
  children: React.ReactNode;
}

export default function PickerGrid({ itemSize = 40, gap = 14, children }: IPickerGrid) {
  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(auto-fill, ${itemSize}px)`,
        justifyContent: 'space-between',
        gap: `${gap}px`,
      }}
    >
      {children}
    </div>
  );
}
