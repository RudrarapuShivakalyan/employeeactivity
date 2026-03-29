# 📋 Page Update Implementation Guide

This guide shows how to convert existing pages to use the modern design system.

---

## Quick Migration Template

Use this template to convert any existing page:

```jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  PageHeader, 
  PageSection, 
  Button, 
  Input, 
  Card,
  Badge,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from "../components/common";
import { showToast } from "../utils/toast";
import { Plus, Edit, Trash2, Search } from "lucide-react";

export default function PageName() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);

  const handleDelete = async (id) => {
    const toastId = showToast.loading("Deleting...");
    try {
      // await api.delete(id)
      setData(data.filter(item => item.id !== id));
      showToast.success("Item deleted successfully!", { id: toastId });
    } catch (error) {
      showToast.error("Failed to delete item", { id: toastId });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with action button */}
      <PageHeader
        title="Your Page Title"
        description="Brief description of page content"
        action={<Button icon={Plus}>Add Item</Button>}
      />

      {/* Main content section */}
      <PageSection 
        title="Items List" 
        subtitle="All items in your system"
      >
        {/* Search bar */}
        <div className="mb-6">
          <Input
            icon={Search}
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Data table */}
        {data.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No items found</p>
          </div>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Name</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <Badge variant={item.active ? "active" : "inactive"}>
                      {item.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        icon={Edit}
                      />
                      <Button 
                        variant="ghost" 
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleDelete(item.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </PageSection>
    </div>
  );
}
```

---

## Converting Specific Pages

### 1. Admin Dashboard / Employee Management

**Current Issues:**
- Multiple tabs as emoji buttons
- Inconsistent spacing
- No proper empty states
- Alert dialogs instead of toasts

**Conversion Steps:**

```jsx
import { TabNavigation, PageHeader, PageSection } from "../components/common";

const [activeTab, setActiveTab] = useState("employees");

const tabs = [
  { id: "employees", label: "Employees" },
  { id: "search", label: "Search" },
  { id: "activities", label: "Activities" },
  { id: "loans", label: "Loans" },
];

return (
  <div className="space-y-8">
    <PageHeader 
      title="Administration" 
      action={<Button icon={Plus}>Add Employee</Button>}
    />

    {/* Tab Navigation */}
    <TabNavigation 
      tabs={tabs} 
      activeTab={activeTab} 
      onChange={setActiveTab}
    />

    {/* Tab Content */}
    <PageSection>
      {activeTab === "employees" && <EmployeeList />}
      {activeTab === "search" && <EmployeeSearch />}
      {activeTab === "activities" && <ActivityLogs />}
      {activeTab === "loans" && <LoanManagement />}
    </PageSection>
  </div>
);
```

### 2. Activity Logs

**Current Issues:**
- Emoji icons instead of proper icons
- Inconsistent card styling
- No filtering UI

**Conversion:**

```jsx
import { 
  PageHeader, 
  PageSection, 
  Card,
  Badge,
  Input,
  Select
} from "../components/common";
import { 
  Activity, 
  Search, 
  Filter 
} from "lucide-react";

return (
  <div className="space-y-8">
    <PageHeader title="Activity Logs" />

    <PageSection>
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Input 
          icon={Search}
          placeholder="Search activities..."
        />
        <Select 
          options={[
            { value: "all", label: "All Types" },
            { value: "login", label: "Login" },
            { value: "edit", label: "Edit" },
            { value: "delete", label: "Delete" }
          ]}
        />
        <Select 
          options={[
            { value: "all", label: "All Status" },
            { value: "pending", label: "Pending" },
            { value: "approved", label: "Approved" }
          ]}
        />
      </div>

      {/* Activity Cards */}
      <div className="space-y-3">
        {activities.map((activity) => (
          <Card key={activity.id} border>
            <div className="p-4 flex items-start gap-4">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Activity size={20} className="text-indigo-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{activity.title}</h3>
                  <Badge variant={activity.status}>
                    {activity.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(activity.date).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PageSection>
  </div>
);
```

### 3. Loan Management

**Current Issues:**
- Alert dialogs for forms
- Inconsistent button styling
- No toast notifications

**Conversion:**

```jsx
import { 
  PageHeader, 
  PageSection, 
  Button,
  Modal,
  Input,
  Select,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  Badge
} from "../components/common";
import { Plus } from "lucide-react";
import { showToast } from "../utils/toast";

const [showForm, setShowForm] = useState(false);
const [loans, setLoans] = useState([]);

const handleSubmit = async (e) => {
  e.preventDefault();
  
  showToast.promise(
    submitLoan(formData),
    {
      loading: "Submitting loan application...",
      success: "Loan application submitted successfully!",
      error: "Failed to submit application"
    }
  );
  
  setShowForm(false);
};

return (
  <div className="space-y-8">
    <PageHeader
      title="Loan Management"
      action={<Button icon={Plus} onClick={() => setShowForm(true)}>
        New Loan Application
      </Button>}
    />

    <PageSection title="Active Loans">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Employee</TableHeader>
            <TableHeader>Amount</TableHeader>
            <TableHeader>Type</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Action</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {loans.map((loan) => (
            <TableRow key={loan.id}>
              <TableCell>{loan.employeeName}</TableCell>
              <TableCell>₹{loan.amount.toLocaleString()}</TableCell>
              <TableCell>{loan.type}</TableCell>
              <TableCell>
                <Badge variant={loan.status.toLowerCase()}>
                  {loan.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleApprove(loan.id)}
                >
                  Approve
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </PageSection>

    {/* Loan Form Modal */}
    <Modal
      open={showForm}
      onClose={() => setShowForm(false)}
      title="New Loan Application"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Loan Amount" type="number" required />
        <Select 
          label="Loan Type"
          options={[
            { value: "personal", label: "Personal" },
            { value: "home", label: "Home" },
            { value: "car", label: "Car" }
          ]}
          required
        />
        <Input label="Tenure (months)" type="number" required />
        <Input label="Reason" type="text" required />
        
        <div className="flex gap-3 pt-4">
          <Button 
            variant="ghost" 
            onClick={() => setShowForm(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Submit Application
          </Button>
        </div>
      </form>
    </Modal>
  </div>
);
```

### 4. Manager Dashboard

**Conversion:**

```jsx
import { 
  PageHeader,
  PageSection,
  StatCard,
  TabNavigation
} from "../components/common";
import { Users, CheckCircle, Clock, TrendingUp } from "lucide-react";

const [activeTab, setActiveTab] = useState("pending");

const stats = [
  {
    label: "Team Members",
    value: 12,
    icon: Users,
    trend: { positive: true, value: "+5%" }
  },
  {
    label: "Approvals Done",
    value: 28,
    icon: CheckCircle,
    trend: { positive: true, value: "All updated" }
  },
  {
    label: "Pending Tasks",
    value: 5,
    icon: Clock
  }
];

return (
  <div className="space-y-8">
    <PageHeader 
      title="Manager Dashboard"
      description="Overview of your team activities"
    />

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>

    {/* Tabs */}
    <TabNavigation
      tabs={[
        { id: "pending", label: "Pending Approvals" },
        { id: "team", label: "Team Activities" },
        { id: "reports", label: "Reports" }
      ]}
      activeTab={activeTab}
      onChange={setActiveTab}
    />

    <PageSection>
      {activeTab === "pending" && <PendingApprovals />}
      {activeTab === "team" && <TeamActivities />}
      {activeTab === "reports" && <Reports />}
    </PageSection>
  </div>
);
```

### 5. Employee Profile

**Conversion:**

```jsx
import { 
  PageHeader,
  PageSection,
  Button,
  Input,
  Select,
  Card,
  Badge,
  Modal
} from "../components/common";
import { Edit, Save, X } from "lucide-react";
import { showToast } from "../utils/toast";

const [editing, setEditing] = useState(false);
const [profile, setProfile] = useState(employee);

const handleSave = async () => {
  showToast.promise(
    updateProfile(profile),
    {
      loading: "Saving changes...",
      success: "Profile updated successfully!",
      error: "Failed to update profile"
    }
  );
  setEditing(false);
};

return (
  <div className="space-y-8">
    <PageHeader
      title={profile.name}
      description={profile.jobTitle}
      action={
        editing ? (
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              icon={X}
              onClick={() => setEditing(false)}
            >
              Cancel
            </Button>
            <Button 
              icon={Save}
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        ) : (
          <Button 
            icon={Edit}
            onClick={() => setEditing(true)}
          >
            Edit Profile
          </Button>
        )
      }
    />

    {/* Profile Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Avatar and Basic Info */}
      <Card>
        <div className="p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
            {profile.name.charAt(0)}
          </div>
          <h2 className="text-xl font-bold">{profile.name}</h2>
          <p className="text-gray-600">{profile.jobTitle}</p>
          <Badge className="mt-3" variant={profile.status === "Active" ? "active" : "inactive"}>
            {profile.status}
          </Badge>
        </div>
      </Card>

      {/* Right Columns - Editable Fields */}
      <Card className="lg:col-span-2">
        <div className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="font-semibold mb-4">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                disabled={!editing}
                value={profile.firstName}
                onChange={(e) => setProfile({...profile, firstName: e.target.value})}
              />
              <Input
                label="Last Name"
                disabled={!editing}
                value={profile.lastName}
                onChange={(e) => setProfile({...profile, lastName: e.target.value})}
              />
              <Input
                label="Email"
                type="email"
                disabled={!editing}
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
              />
              <Input
                label="Phone"
                disabled={!editing}
                value={profile.phone}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
              />
            </div>
          </div>

          {/* Employment Details */}
          <div className="pt-6 border-t">
            <h3 className="font-semibold mb-4">Employment Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Employee ID"
                disabled
                value={profile.employeeId}
              />
              <Input
                label="Department"
                disabled={!editing}
                value={profile.department}
              />
              <Input
                label="Joining Date"
                type="date"
                disabled={!editing}
                value={profile.joiningDate}
              />
              <Input
                label="Salary"
                type="number"
                disabled={!editing}
                value={profile.salary}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
);
```

---

## Color Reference for Status Badges

```jsx
// Status mapping
const statusVariants = {
  "Active": "active",        // green
  "Inactive": "inactive",    // gray
  "Pending": "pending",      // yellow
  "Approved": "approved",    // green
  "Rejected": "rejected",    // red
  "Draft": "default",        // gray
  "Completed": "success",    // green
};

// Usage
<Badge variant={statusVariants[status]}>
  {status}
</Badge>
```

---

## Form Patterns

### Basic Form
```jsx
const [form, setForm] = useState({});
const [errors, setErrors] = useState({});

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validate
  if (!form.name) {
    setErrors({ name: "Name is required" });
    return;
  }
  
  // Submit
  showToast.promise(
    submitForm(form),
    {
      loading: "Saving...",
      success: "Saved successfully!",
      error: "Failed to save"
    }
  );
};

return (
  <form onSubmit={handleSubmit} className="space-y-4">
    <Input
      label="Name"
      value={form.name}
      onChange={(e) => setForm({...form, name: e.target.value})}
      error={errors.name}
      required
    />
    <Select
      label="Category"
      options={categoryOptions}
      value={form.category}
      onChange={(e) => setForm({...form, category: e.target.value})}
    />
    <Button type="submit" variant="primary">
      Submit
    </Button>
  </form>
);
```

### Search & Filter Pattern
```jsx
const [search, setSearch] = useState("");
const [filters, setFilters] = useState({});

const filtered = data.filter(item => {
  const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
  const matchesFilters = Object.entries(filters).every(
    ([key, value]) => !value || item[key] === value
  );
  return matchesSearch && matchesFilters;
});

return (
  <PageSection title="Data Table">
    <div className="space-y-4 mb-6">
      <Input
        icon={Search}
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          options={departments}
          placeholder="Filter by department"
          onChange={(e) => setFilters({...filters, department: e.target.value})}
        />
        <Select
          options={statuses}
          placeholder="Filter by status"
          onChange={(e) => setFilters({...filters, status: e.target.value})}
        />
      </div>
    </div>
    
    <Table>
      {/* Table content */}
    </Table>
  </PageSection>
);
```

---

## Testing Checklist After Update

- [ ] Form inputs are properly styled
- [ ] Buttons have correct variants and sizes
- [ ] Badges show correct colors
- [ ] Tables are responsive
- [ ] Modal/dialogs work correctly
- [ ] Toast notifications appear
- [ ] Page is responsive on mobile
- [ ] No console errors
- [ ] Accessibility is maintained
- [ ] Loading states work

---

## Common Issues & Solutions

### Issue: Old styling still visible
**Solution**: Clear browser cache, do hard refresh (Ctrl+Shift+R)

### Issue: Icons not showing
**Solution**: Ensure lucide-react is imported correctly
```jsx
import { IconName } from "lucide-react";
```

### Issue: Colors not matching
**Solution**: Use Tailwind classes directly, not design tokens
```jsx
// ❌ Wrong
className={`bg-${colors.primary[600]}`}

// ✅ Correct
className="bg-indigo-600"
```

### Issue: Modal appears behind something
**Solution**: Check z-index, modal uses `z-50`

### Issue: Toast notifications not appearing
**Solution**: Ensure Toaster is in main.jsx
```jsx
import { Toaster } from "sonner";

<Toaster position="bottom-right" richColors />
```

---

## Performance Tips

1. **Lazy load heavy components**
```jsx
const HeavyComponent = lazy(() => import("./HeavyComponent"));

<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>
```

2. **Debounce search inputs**
```jsx
const [search, setSearch] = useState("");
const debouncedSearch = useCallback(
  debounce((value) => {
    // API call here
  }, 300),
  []
);
```

3. **Memo expensive renders**
```jsx
const TableRow = memo(({ row, onDelete }) => (
  // Component
));
```

---

**Implementation Guide Version**: 1.0  
**Last Updated**: March 27, 2026
