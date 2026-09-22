import { resolveLucideIcon } from '@/components/accounts/lucideIcon';
import { useIconColors } from '@/hooks/useIconColors';
import { Text } from '@/shared/Text';
import { ChevronDown, Search, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

export interface SelectOption {
  id: number | string;
  name: string;
  icon: string;
  color: string;
}

interface SelectFieldProps<T extends SelectOption> {
  label: string;
  placeholder: string;
  options: T[];
  value: T | null;
  onChange: (item: T) => void;
  error?: string;
  renderExtra?: (item: T) => React.ReactNode;
}

export default function SelectField<T extends SelectOption>({
  label,
  placeholder,
  options,
  value,
  onChange,
  error,
  renderExtra,
}: SelectFieldProps<T>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const icon = useIconColors();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => {
      setOpen(false);
      setSearch('');
    };
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, []);

  const filtered = options.filter((o) =>
    o.name.toLowerCase().includes(search.toLowerCase()),
  );

  const dismiss = () => {
    setOpen(false);
    setSearch('');
  };

  const handleSelect = (item: T) => {
    onChange(item);
    dismiss();
  };

  const SelectedIcon = value ? resolveLucideIcon(value.icon) : null;

  return (
    <div className="flex flex-col gap-2">
      <Text variant="label" className="text-foreground">
        {label}
      </Text>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex flex-row items-center h-input px-4 gap-3 rounded-lg bg-card border border-subtle-border cursor-pointer w-full text-left"
      >
        {value && SelectedIcon ? (
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: value.color + '20' }}
          >
            <SelectedIcon size={20} color={value.color} strokeWidth={1.8} />
          </div>
        ) : null}

        <Text
          variant="body"
          className={`flex-1 ${value ? 'text-foreground' : 'text-muted-foreground'}`}
        >
          {value ? value.name : placeholder}
        </Text>

        <ChevronDown size={16} color={icon.subtle} />
      </button>

      {error ? (
        <Text variant="caption" className="text-destructive pl-1">
          {error}
        </Text>
      ) : null}

      <dialog
        ref={dialogRef}
        onClick={(e) => {
          if (e.target === dialogRef.current) dismiss();
        }}
        className={`border-none rounded-card p-0 w-11/12 max-w-dialog-md max-h-dropdown overflow-hidden${open ? ' flex flex-col' : ''}`}
      >
        {/* Header */}
        <div className="flex flex-row items-center justify-between px-5 pt-4 pb-3 border-b border-subtle-border flex-shrink-0">
          <Text variant="h3" className="text-foreground">
            {label}
          </Text>
          <button type="button" onClick={dismiss} className="border-0 bg-transparent cursor-pointer p-1">
            <X size={20} color={icon.muted} />
          </button>
        </div>

        {/* Search */}
        <div className="flex flex-row items-center h-11 mx-4 my-3 px-3 gap-2 rounded-lg bg-muted border border-subtle-border flex-shrink-0">
          <Search size={16} color={icon.subtle} />
          <input
            className="flex-1 border-0 bg-transparent outline-none text-foreground text-body"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>

        {/* List */}
        <div className="overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <Text variant="bodySm" className="text-center text-muted-foreground py-6 block">
              No results
            </Text>
          ) : (
            filtered.map((item) => {
              const Icon = resolveLucideIcon(item.icon);
              const isSelected = value?.id === item.id;
              return (
                <button
                  key={String(item.id)}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="flex flex-row items-center w-full px-5 py-3 gap-3 border-0 cursor-pointer text-left"
                  style={{ backgroundColor: isSelected ? item.color + '12' : 'transparent' }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: item.color + '20' }}
                  >
                    <Icon size={20} color={item.color} strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Text
                      variant="bodySm"
                      className={`text-foreground ${isSelected ? 'font-bold' : 'font-medium'}`}
                    >
                      {item.name}
                    </Text>
                    {renderExtra ? renderExtra(item) : null}
                  </div>
                  {isSelected && (
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                  )}
                </button>
              );
            })
          )}
        </div>
      </dialog>
    </div>
  );
}
