# Modern UI/UX Design System

## 🎨 Overview
This document outlines the comprehensive design system and components used in the Employee Management System. The system is built with Tailwind CSS v4+ and modern React patterns for a professional, real-world appearance.

---

## 📊 Design Tokens

All design decisions are based on a centralized token system located in `src/styles/design-tokens.js`.

### Color Palette

#### Primary Colors
- **Primary Blue**: `#4f46e5` - Main brand color for primary actions
- **Secondary Purple**: `#8b5cf6` - Accent color for highlights

#### Semantic Colors
- **Success**: `#22c55e` - Positive actions, confirmations
- **Warning**: `#f59e0b` - Caution, warnings
- **Error**: `#ef4444` - Destructive actions, errors
- **Info**: `#3b82f6` - Informational messages

#### Neutral Palette
- **Foreground**: `#111827` - Primary text
- **Surface**: `#ffffff` - Page background
- **Border**: `#d1d5db` - Dividers, borders
- **Muted**: `#6b7280` - Disabled, secondary text

### Spacing Scale
```
xs: 4px    (0.25rem)
sm: 8px    (0.5rem)
md: 16px   (1rem)
lg: 24px   (1.5rem)
xl: 32px   (2rem)
2xl: 40px  (2.5rem)
```

### Typography
- **Font Family**: System font stack (sans-serif)
- **Font Weights**: 300, 400, 500, 600, 700, 800
- **Font Sizes**: xs(12px) to 4xl(36px)

---

## 🧩 Component Library

All reusable components are in `src/components/common/`.

### Button Component
**File**: `src/components/common/Button.jsx`

```jsx
import { Button } from "@/components/common";

// Variants: primary, secondary, outline, danger, success, ghost
// Sizes: xs, sm, md, lg, xl
// Props: variant, size, loading, disabled, icon, iconPosition

<Button variant="primary" size="md">
  Click Me
</Button>

<Button 
  variant="outline" 
  icon={SearchIcon} 
  iconPosition="left"
>
  Search
</Button>
```

### Input Component
**File**: `src/components/common/Input.jsx`

```jsx
import { Input } from "@/components/common";

<Input
  label="Email"
  type="email"
  placeholder="user@example.com"
  icon={MailIcon}
  error={errorMessage}
  required
/>
```

### Select Component
**File**: `src/components/common/Select.jsx`

```jsx
import { Select } from "@/components/common";

<Select
  label="Department"
  options={[
    { value: "it", label: "IT" },
    { value: "hr", label: "Human Resources" }
  ]}
  required
/>
```

### Badge Component
**File**: `src/components/common/Badge.jsx`

```jsx
import { Badge } from "@/components/common";

// Variants: default, primary, success, warning, error, info, purple
// Status variants: active, inactive, pending, approved, rejected
// Sizes: sm, md, lg

<Badge variant="success">Active</Badge>
<Badge variant="pending" size="sm">In Progress</Badge>
```

### Card Component
**File**: `src/components/common/Card.jsx`

```jsx
import { Card } from "@/components/common";

<Card shadow="lg" border>
  <div className="p-6">Card Content</div>
</Card>
```

### Modal Component
**File**: `src/components/common/Modal.jsx`

```jsx
import { Modal } from "@/components/common";

<Modal 
  open={isOpen} 
  onClose={handleClose} 
  title="Confirm Action"
  size="md"
>
  <p>Are you sure?</p>
</Modal>
```

### Table Component
**File**: `src/components/common/Table.jsx`

```jsx
import { 
  Table, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableHeader, 
  TableCell 
} from "@/components/common";

<Table>
  <TableHead>
    <TableRow>
      <TableHeader>Name</TableHeader>
      <TableHeader>Email</TableHeader>
    </TableRow>
  </TableHead>
  <TableBody>
    {items.map(item => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.email}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Layout Components
**File**: `src/components/common/Layout.jsx`

#### PageHeader
```jsx
<PageHeader 
  title="Employees" 
  description="Manage your team"
  action={<Button>Add Employee</Button>}
/>
```

#### PageSection
```jsx
<PageSection 
  title="Settings" 
  subtitle="Manage your preferences"
>
  {...content}
</PageSection>
```

#### StatCard
```jsx
<StatCard
  label="Total Employees"
  value={28}
  icon={UsersIcon}
  trend={{ positive: true, value: "+12% from last month" }}
/>
```

#### TabNavigation
```jsx
<TabNavigation
  tabs={[
    { id: "all", label: "All" },
    { id: "active", label: "Active" }
  ]}
  activeTab={active}
  onChange={setActive}
/>
```

#### EmptyState
```jsx
<EmptyState
  icon={EmptyIcon}
  title="No Data"
  description="There's nothing here yet"
  action={<Button>Get Started</Button>}
/>
```

---

## 🔔 Toast Notifications

**File**: `src/utils/toast.js`

Use Sonner toast library for notifications:

```jsx
import { showToast } from "@/utils/toast";

// Success
showToast.success("Action completed!");

// Error
showToast.error("Something went wrong");

// Warning
showToast.warning("Please review your input");

// Info
showToast.info("Here's some information");

// Loading
const id = showToast.loading("Processing...");
showToast.dismiss(id);

// Promise-based
showToast.promise(
  fetchData(),
  {
    loading: "Loading...",
    success: "Done!",
    error: "Error occurred"
  }
);
```

---

## 🎨 Layout System

### Main Application Layout
**File**: `src/components/layouts/MainLayout.jsx`

Features:
- Collapsible sidebar navigation
- Role-based menu items
- Top notification bar
- User profile menu
- Responsive design

**Usage in Router**:
```jsx
import MainLayout from "@/components/layouts/MainLayout";

<Route element={<MainLayout />}>
  <Route path="/admin" element={<AdminDashboard />} />
  <Route path="/manager" element={<ManagerDashboard />} />
  {/* ... other routes */}
</Route>
```

---

## 🌈 Color Implementation

### Using Design Tokens
```jsx
import { colors, spacing } from "@/styles/design-tokens";

// Apply colors
<div style={{ backgroundColor: colors.primary[600] }}>
  Text
</div>

// Or use Tailwind utilities directly
<div className="bg-indigo-600 text-white p-6">
  Content
</div>
```

### Gradient Effects
```jsx
// Gradient backgrounds
<div className="bg-gradient-to-br from-indigo-500 to-purple-600">
  Gradient Box
</div>

// Gradient text
<h1 className="gradient-text">Gradient Text</h1>
```

---

## ✨ Animations

Available CSS animations (defined in `src/index.css`):

- `animate-fade-in` - Fade in effect (300ms)
- `animate-slide-up` - Slide up from bottom (400ms)
- `animate-slide-down` - Slide down from top (400ms)
- `animate-spin-slow` - Slow rotation (2s)
- `animate-pulse-subtle` - Subtle pulsing (2s)
- `animate-bounce-soft` - Soft bounce (1s)

**Usage**:
```jsx
<div className="animate-fade-in">Content appears with fade</div>
<div className="animate-slide-up">Content slides up</div>
```

---

## 📱 Responsive Design

### Breakpoints
- **xs**: 320px (mobile)
- **sm**: 640px (tablet)
- **md**: 768px (small desktop)
- **lg**: 1024px (desktop)
- **xl**: 1280px (large desktop)
- **2xl**: 1536px (extra large)

### Tailwind Responsive Classes
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Single column on mobile, 2 on tablet, 3 on desktop */}
</div>

<div className="hidden md:block">
  {/* Hidden on mobile, visible on tablet+ */}
</div>
```

---

## 🎯 Best Practices

### 1. Component Usage
- Always import from `src/components/common`
- Prefer composition over prop drilling
- Keep components focused and single-responsibility

### 2. Styling
- Use Tailwind utility classes for styling
- Avoid inline styles (use design tokens instead)
- Use `clsx` for conditional classes

```jsx
import clsx from "clsx";

<div className={clsx(
  "p-4 rounded-lg",
  isActive && "bg-indigo-600 text-white",
  !isActive && "bg-gray-100"
)}>
  Content
</div>
```

### 3. Forms
- Always include labels for accessibility
- Show validation errors clearly
- Provide helper text for guidance

```jsx
<Input
  label="Email Address"
  type="email"
  placeholder="user@example.com"
  error={errors.email}
  helperText="We'll never share your email"
  required
/>
```

### 4. Accessibility
- Use semantic HTML
- Include ARIA labels where needed
- Ensure keyboard navigation works
- Maintain sufficient color contrast

### 5. Performance
- Lazy load components for large lists
- Use React.memo for expensive renders
- Debounce search and filter inputs
- Optimize images and assets

---

## 📋 Color Reference Quick Guide

| Use Case | Color | Tailwind Class |
|----------|-------|----------------|
| Primary Action | Indigo 600 | `bg-indigo-600` |
| Secondary Action | Gray 200 | `bg-gray-200` |
| Success/Active | Green 600 | `bg-green-600` |
| Warning | Yellow 500 | `bg-yellow-500` |
| Danger/Error | Red 600 | `bg-red-600` |
| Info | Blue 600 | `bg-blue-600` |
| Text Primary | Gray 900 | `text-gray-900` |
| Text Secondary | Gray 600 | `text-gray-600` |
| Border | Gray 200 | `border-gray-200` |

---

## 🚀 Common Patterns

### Success Dialog
```jsx
<Modal open={success} onClose={resetForm} title="Success">
  <p>Your changes have been saved successfully.</p>
  <div className="mt-4 flex gap-3">
    <Button variant="primary" onClick={resetForm}>Done</Button>
  </div>
</Modal>
```

### Confirmation Dialog
```jsx
<Modal open={showConfirm} onClose={() => setShowConfirm(false)} title="Confirm">
  <p>Are you sure you want to delete this item?</p>
  <div className="mt-6 flex gap-3">
    <Button variant="ghost" onClick={() => setShowConfirm(false)}>Cancel</Button>
    <Button variant="danger" onClick={handleDelete}>Delete</Button>
  </div>
</Modal>
```

### Loading State
```jsx
<Button loading={isLoading}>
  {isLoading ? "Processing..." : "Submit"}
</Button>
```

### Empty State
```jsx
<EmptyState
  icon={InboxIcon}
  title="No Results"
  description="Try adjusting your search criteria"
  action={<Button onClick={resetFilters}>Clear Filters</Button>}
/>
```

---

## 🔧 Maintenance & Updates

To update the design system:

1. **Update tokens** in `src/styles/design-tokens.js`
2. **Update components** in `src/components/common/`
3. **Update global styles** in `src/index.css`
4. **Test across all pages** for consistency

---

## 📚 Resources

- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)
- [Sonner Toast](https://sonner.emilkowal.ski)
- [React Best Practices](https://react.dev)

---

**Last Updated**: March 27, 2026  
**Version**: 1.0.0
