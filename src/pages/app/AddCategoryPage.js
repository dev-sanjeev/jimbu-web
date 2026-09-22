import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import AddScreenHeader from '@/components/shared/AddScreenHeader';
import ColorPicker from '@/components/shared/ColorPicker';
import FormActions from '@/components/shared/FormActions';
import FormField from '@/components/shared/FormField';
import IconPicker from '@/components/shared/IconPicker';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { resolveLucideIcon } from '@/components/accounts/lucideIcon';
import { useCreateCategory } from '@/hooks/categories/useCreateCategory';
import { useDeleteCategory } from '@/hooks/categories/useDeleteCategory';
import { useUpdateCategory } from '@/hooks/categories/useUpdateCategory';
import { useIconColors } from '@/hooks/useIconColors';
import { TransactionType } from '@/interfaces/components/ITransaction';
import { CATEGORY_COLORS, DEFAULT_CATEGORY_COLOR, EXPENSE_TYPE_COLOR, INCOME_TYPE_COLOR, } from '@/shared/categoryPalette';
import { Text } from '@/shared/Text';
import { Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react'; // useRef for initialForm
import { toast } from 'sonner';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
const ICON_NAMES = [
    'utensils', 'shopping-cart', 'car', 'home', 'zap', 'stethoscope', 'gamepad-2',
    'shopping-bag', 'graduation-cap', 'plane', 'scissors', 'repeat', 'shield-check',
    'save', 'more-horizontal', 'banknote', 'laptop', 'trending-up', 'building', 'gift',
    'trophy', 'plus-circle', 'wallet', 'briefcase', 'heart', 'coffee', 'film',
    'book-open', 'tag', 'credit-card',
];
const ICONS = ICON_NAMES.map((id) => ({ id, component: resolveLucideIcon(id) }));
export default function AddCategoryPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const mode = searchParams.get('mode') ?? 'add';
    const icon = useIconColors();
    const isEditMode = mode === 'edit' && !!id;
    const categoryType = searchParams.get('type') ?? TransactionType.EXPENSE;
    const typeColor = categoryType === TransactionType.EXPENSE ? EXPENSE_TYPE_COLOR : INCOME_TYPE_COLOR;
    const [form, setForm] = useState({
        name: searchParams.get('name') ?? '',
        icon: searchParams.get('icon') ?? 'tag',
        color: searchParams.get('color') ?? DEFAULT_CATEGORY_COLOR,
    });
    const initialForm = useRef(form);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);
    const isDirty = form.name !== initialForm.current.name ||
        form.icon !== initialForm.current.icon ||
        form.color !== initialForm.current.color;
    const handleCancel = () => {
        if (!isDirty) {
            navigate(-1);
            return;
        }
        setConfirmDiscardOpen(true);
    };
    useEffect(() => {
        if (isEditMode) {
            setForm({
                name: searchParams.get('name') ?? '',
                icon: searchParams.get('icon') ?? 'tag',
                color: searchParams.get('color') ?? DEFAULT_CATEGORY_COLOR,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);
    const createCategory = useCreateCategory();
    const updateCategory = useUpdateCategory();
    const deleteCategory = useDeleteCategory();
    const handleSave = () => {
        if (!form.name.trim())
            return;
        if (isEditMode && id) {
            updateCategory.mutate({ id: parseInt(id, 10), payload: { name: form.name.trim(), icon: form.icon, color: form.color } }, {
                onSuccess: () => { toast.success('Category updated!'); navigate(-1); },
                onError: () => toast.error('Could not update the category', { description: 'Please try again.' }),
            });
            return;
        }
        createCategory.mutate({ name: form.name.trim(), type: categoryType, icon: form.icon, color: form.color }, {
            onSuccess: () => { toast.success('Category added!'); navigate(-1); },
            onError: () => toast.error('Could not create the category', { description: 'Please try again.' }),
        });
    };
    const handleDelete = () => {
        if (!isEditMode || !id)
            return;
        setConfirmDeleteOpen(true);
    };
    const isSaving = createCategory.isPending || updateCategory.isPending;
    const headerTitle = isEditMode ? 'Edit Category' : 'Add Category';
    const PreviewIcon = resolveLucideIcon(form.icon);
    return (_jsxs(ScreenWrapper, { children: [_jsx(ConfirmDialog, { open: confirmDeleteOpen, title: "Delete Category", message: "This category will be permanently removed. Are you sure?", confirmLabel: "Delete", variant: "destructive", onConfirm: () => {
                    setConfirmDeleteOpen(false);
                    deleteCategory.mutate(parseInt(id, 10), {
                        onSuccess: () => { toast.success('Category deleted!'); navigate(-1); },
                        onError: () => toast.error('Could not delete the category'),
                    });
                }, onCancel: () => setConfirmDeleteOpen(false) }), _jsx(ConfirmDialog, { open: confirmDiscardOpen, title: "Discard changes?", message: "You'll lose any details you've entered.", confirmLabel: "Discard", variant: "default", onConfirm: () => navigate(-1), onCancel: () => setConfirmDiscardOpen(false) }), _jsx(AddScreenHeader, { title: headerTitle, onBack: handleCancel }), _jsxs("div", { className: "flex-1 overflow-y-auto pb-20 pt-2 flex flex-col gap-6", children: [_jsxs("div", { children: [_jsx(Text, { variant: "caption", className: "font-semibold text-foreground uppercase tracking-wider mb-2 pl-1", children: "Preview" }), _jsxs("div", { className: "bg-card rounded-2xl p-6 flex flex-col items-center border border-subtle-border gap-2.5", children: [_jsx("div", { className: "w-10 h-10 rounded-full flex items-center justify-center", style: { backgroundColor: form.color + '20' }, children: _jsx(PreviewIcon, { size: 20, color: form.color, strokeWidth: 1.8 }) }), _jsx(Text, { variant: "h3", className: "text-foreground", children: form.name || (isEditMode ? 'Category Name' : 'New Category') }), _jsx("div", { className: "px-3 py-1 rounded-xl", style: { backgroundColor: typeColor + '20' }, children: _jsx(Text, { variant: "caption", className: "font-semibold", style: { color: typeColor }, children: categoryType === TransactionType.EXPENSE ? 'Expense' : 'Income' }) })] })] }), _jsx(FormField, { label: "Category Name", value: form.name, onChangeText: (v) => setForm((prev) => ({ ...prev, name: v })), placeholder: "Enter category name", icon: (() => {
                            const FieldIcon = resolveLucideIcon(form.icon);
                            return _jsx(FieldIcon, { size: 20, color: icon.muted, strokeWidth: 1.8 });
                        })() }), _jsx(ColorPicker, { label: "Color", colors: [...CATEGORY_COLORS], value: form.color, onChange: (color) => setForm((prev) => ({ ...prev, color })) }), _jsx(IconPicker, { label: "Icon", icons: ICONS, value: form.icon, onChange: (iconId) => setForm((prev) => ({ ...prev, icon: iconId })) }), _jsx(FormActions, { onCancel: handleCancel, onSave: handleSave, saveLabel: isEditMode ? 'Save Changes' : 'Add Category', disabled: !form.name.trim(), isSaving: isSaving }), isEditMode && (_jsxs("button", { type: "button", onClick: handleDelete, disabled: deleteCategory.isPending, className: "flex flex-row items-center justify-center gap-2 py-4 rounded-xl border border-destructive/30 bg-destructive/5 cursor-pointer", children: [_jsx(Trash2, { size: 20, color: icon.destructive, strokeWidth: 1.8 }), _jsx(Text, { variant: "body", className: "font-semibold text-destructive", children: "Delete Category" })] }))] })] }));
}
