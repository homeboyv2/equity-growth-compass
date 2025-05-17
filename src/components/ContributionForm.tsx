
import React, { useState } from 'react';
import { useFounders } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ContributionType } from '@/types';
import { z } from 'zod';
import { toast } from 'sonner';
import { PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ContributionFormProps {
  founderId: string;
}

const contributionSchema = z.object({
  type: z.enum(['cash', 'time', 'skills'] as const),
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(3, 'Description must be at least 3 characters')
});

const ContributionForm: React.FC<ContributionFormProps> = ({ founderId }) => {
  const { addContribution } = useFounders();
  const [type, setType] = useState<ContributionType>('cash');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      const validatedData = contributionSchema.parse({
        type,
        amount: Number(amount),
        description
      });
      
      addContribution(founderId, validatedData);
      setAmount('');
      setDescription('');
      setType('cash');
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
        toast.error(err.errors[0].message);
      } else {
        setError('An error occurred');
        toast.error('Failed to add contribution');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Add Contribution</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Contribution Type</Label>
              <Select 
                value={type} 
                onValueChange={(value: ContributionType) => setType(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash Investment</SelectItem>
                  <SelectItem value="time">Time Investment</SelectItem>
                  <SelectItem value="skills">Skills / Resources</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">
                {type === 'cash' ? 'Amount ($)' : type === 'time' ? 'Hours' : 'Value (points)'}
              </Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={type === 'cash' ? '1000' : type === 'time' ? '40' : '10'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of contribution"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" className="w-full">
              <PlusCircle className="w-4 h-4 mr-2" /> 
              Add Contribution
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContributionForm;
