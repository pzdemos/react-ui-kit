import React, { useState } from 'react';
import { Button } from './components/ui/Button';
import { Input, Select, Checkbox } from './components/ui/Form';
import { useToast } from './context/ToastContext';
import { useDialog } from './context/DialogContext';
import { Bell, Trash2, Check, Save } from 'lucide-react';

const App = () => {
  const { toast } = useToast();
  const { confirm, alert } = useDialog();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'developer',
    subscribe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error on change
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleToastDemo = (type: 'success' | 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'success':
        toast.success("Operation completed successfully!", "Success");
        break;
      case 'error':
        toast.error("Something went wrong.", "Error");
        break;
      case 'warning':
        toast.warning("Your session is about to expire.", "Warning");
        break;
      case 'info':
        toast.info("There is a new update available.", "Did you know?");
        break;
    }
  };

  const handleDelete = async () => {
    const isConfirmed = await confirm({
      title: 'Delete Account',
      description: 'Are you sure you want to delete your account? This action cannot be undone and all data will be lost.',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
      variant: 'danger'
    });

    if (isConfirmed) {
      // Simulate API call
      toast.info("Deleting...", "Processing");
      setTimeout(() => {
        toast.success("Account deleted successfully.");
      }, 1000);
    } else {
      toast.info("Action cancelled.");
    }
  };

  const handleAlert = async () => {
    await alert({
      title: 'Terms of Service Updated',
      description: 'We have updated our privacy policy and terms of service. Please review them.',
      confirmText: 'Understood'
    });
    console.log("User acknowledged alert");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email address";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors in the form.", "Validation Error");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate async submit
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("User profile updated successfully!", "Saved");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            React UI Component Kit
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            A demonstration of Toast notifications, Modal dialogs, and Form components.
          </p>
        </div>

        {/* Components Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Section: Toasts & Dialogs */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary-600" />
                Feedback & Overlays
              </h2>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Toast Notifications</h3>
              <div className="flex flex-wrap gap-3">
                <Button size="sm" onClick={() => handleToastDemo('success')} className="bg-green-600 hover:bg-green-700">Success</Button>
                <Button size="sm" onClick={() => handleToastDemo('error')} variant="danger">Error</Button>
                <Button size="sm" onClick={() => handleToastDemo('warning')} className="bg-amber-500 hover:bg-amber-600 text-white">Warning</Button>
                <Button size="sm" onClick={() => handleToastDemo('info')} className="bg-blue-500 hover:bg-blue-600 text-white">Info</Button>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Dialogs</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="danger" leftIcon={<Trash2 size={16}/>} onClick={handleDelete}>
                  Confirm Delete
                </Button>
                <Button variant="secondary" onClick={handleAlert}>
                  Trigger Alert
                </Button>
              </div>
              <p className="text-xs text-slate-500">
                These dialogs use a Promise-based API. Click to test the async flow.
              </p>
            </div>
          </div>

          {/* Section: Forms */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
             <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Check className="w-5 h-5 text-primary-600" />
                Form Elements
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                name="name"
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={handleInputChange}
                error={errors.name}
              />
              
              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                helperText="We'll never share your email with anyone else."
              />

              <Select
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                options={[
                  { label: 'Developer', value: 'developer' },
                  { label: 'Designer', value: 'designer' },
                  { label: 'Manager', value: 'manager' },
                  { label: 'Other', value: 'other' },
                ]}
              />

              <div className="pt-2">
                <Checkbox
                  label="Subscribe to newsletter"
                  name="subscribe"
                  checked={formData.subscribe}
                  onChange={handleInputChange}
                />
              </div>

              <div className="pt-4 flex justify-end">
                <Button 
                  type="submit" 
                  isLoading={isSubmitting} 
                  leftIcon={<Save size={16} />}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;
