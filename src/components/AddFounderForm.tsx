
import React, { useState } from 'react';
import { useFounders } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { UserPlus } from 'lucide-react';

const initialFounderState = {
  name: '',
  role: '',
  email: '',
  scores: {
    role: 5,
    usefulness: 5,
    ideaContribution: 5,
    businessPlan: 5,
    expertise: 5,
    commitment: 5,
    operations: 5
  }
};

const AddFounderForm: React.FC = () => {
  const [founder, setFounder] = useState(initialFounderState);
  const [showForm, setShowForm] = useState(false);
  const { addFounder } = useFounders();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFounder(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!founder.name || !founder.role) {
      toast.error('Please provide at least a name and role for the co-founder');
      return;
    }
    
    addFounder(founder);
    setFounder(initialFounderState);
    setShowForm(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border">
      {!showForm ? (
        <Button 
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add Co-founder</span>
        </Button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
          <h3 className="text-lg font-medium">Add New Co-founder</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name*</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Smith"
                value={founder.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role*</Label>
              <Input
                id="role"
                name="role"
                placeholder="CTO, Designer, etc."
                value={founder.role}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email (optional)</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@startup.com"
              value={founder.email}
              onChange={handleChange}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Co-founder</Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddFounderForm;
