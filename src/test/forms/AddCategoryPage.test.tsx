import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AddCategoryPage from '@/pages/app/AddCategoryPage';

const FUTURE = { v7_startTransition: true, v7_relativeSplatPath: true };

const makeRender = (path: string) => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={[path]} future={FUTURE}>
        <Routes>
          <Route path="/main/categories/new" element={<AddCategoryPage />} />
          <Route path="/main/categories/:id/edit" element={<AddCategoryPage />} />
          <Route path="/main" element={<div>Main Page</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe('AddCategoryPage', () => {
  it('shows "Add Category" title in create mode', () => {
    makeRender('/main/categories/new');
    expect(screen.getByRole('heading', { name: 'Add Category' })).toBeInTheDocument();
  });

  it('shows "Edit Category" title in edit mode', () => {
    makeRender('/main/categories/1/edit?mode=edit');
    expect(screen.getByRole('heading', { name: 'Edit Category' })).toBeInTheDocument();
  });

  it('save button is disabled when name is empty', () => {
    makeRender('/main/categories/new');
    expect(screen.getByRole('button', { name: /add category/i })).toBeDisabled();
  });

  it('save button is enabled after typing a name', async () => {
    const user = userEvent.setup();
    makeRender('/main/categories/new');
    await user.type(screen.getByPlaceholderText('Enter category name'), 'Food');
    expect(screen.getByRole('button', { name: /add category/i })).not.toBeDisabled();
  });

  it('opens discard dialog when cancel is clicked after typing a name', async () => {
    const user = userEvent.setup();
    makeRender('/main/categories/new');
    await user.type(screen.getByPlaceholderText('Enter category name'), 'Food');
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    const discardDialog = screen.getByRole('heading', { name: 'Discard changes?' }).closest('dialog');
    expect(discardDialog).toHaveAttribute('open');
  });

  it('shows delete button in edit mode', () => {
    makeRender('/main/categories/1/edit?mode=edit');
    expect(screen.getByRole('button', { name: /delete category/i })).toBeInTheDocument();
  });

  it('opens delete confirm dialog when delete button is clicked in edit mode', async () => {
    const user = userEvent.setup();
    makeRender('/main/categories/1/edit?mode=edit');
    await user.click(screen.getByRole('button', { name: /delete category/i }));
    const deleteDialog = screen.getByRole('heading', { name: 'Delete Category' }).closest('dialog');
    expect(deleteDialog).toHaveAttribute('open');
  });
});
