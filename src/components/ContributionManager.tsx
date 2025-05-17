
import React, { useState } from 'react';
import { useFounders } from '@/context/AppContext';
import { Contribution, ContributionWeights, Founder } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { PlusCircle, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';

interface ContributionFormProps {
  onSubmit: (contribution: Omit<Contribution, 'id'>) => void;
}

const ContributionForm: React.FC<ContributionFormProps> = ({ onSubmit }) => {
  const [type, setType] = useState<'cash' | 'time' | 'skills'>('cash');
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type,
      amount,
      description,
      date: new Date().toISOString()
    });
    // Reset form
    setAmount(0);
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Contribution Type</label>
          <Select 
            value={type} 
            onValueChange={(value) => setType(value as 'cash' | 'time' | 'skills')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash Investment</SelectItem>
              <SelectItem value="time">Time Spent</SelectItem>
              <SelectItem value="skills">Skills/Resources</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Amount 
            {type === 'cash' ? ' ($)' : type === 'time' ? ' (hours)' : ' (units)'}
          </label>
          <Input 
            type="number" 
            min={0}
            value={amount || ''}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            placeholder={type === 'cash' ? "Dollar amount" : type === 'time' ? "Hours" : "Resource units"}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description of contribution"
        />
      </div>
      
      <Button type="submit" className="w-full">
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Contribution
      </Button>
    </form>
  );
};

interface ContributionWeightControlProps {
  weights: ContributionWeights;
  onWeightChange: (type: keyof ContributionWeights, value: number) => void;
}

const ContributionWeightControl: React.FC<ContributionWeightControlProps> = ({ 
  weights, 
  onWeightChange 
}) => {
  return (
    <div className="space-y-6 bg-gray-50 p-4 rounded-lg">
      <h3 className="font-medium">Contribution Type Weights</h3>
      <p className="text-xs text-gray-500">
        Adjust how different contribution types affect equity calculations.
        Higher values give more weight to that contribution type.
      </p>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm">Cash Investment Weight</label>
            <span className="text-sm font-medium">{weights.cash.toFixed(1)}x</span>
          </div>
          <Slider
            value={[weights.cash * 10]}
            min={1}
            max={30}
            step={1}
            onValueChange={([value]) => onWeightChange('cash', value / 10)}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm">Time Contribution Weight</label>
            <span className="text-sm font-medium">{weights.time.toFixed(1)}x</span>
          </div>
          <Slider
            value={[weights.time * 10]}
            min={1}
            max={30}
            step={1}
            onValueChange={([value]) => onWeightChange('time', value / 10)}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm">Skills/Resources Weight</label>
            <span className="text-sm font-medium">{weights.skills.toFixed(1)}x</span>
          </div>
          <Slider
            value={[weights.skills * 10]}
            min={1}
            max={30}
            step={1}
            onValueChange={([value]) => onWeightChange('skills', value / 10)}
          />
        </div>
      </div>
    </div>
  );
};

interface ContributionListProps {
  founder: Founder;
  onRemove: (contributionId: string) => void;
}

const ContributionList: React.FC<ContributionListProps> = ({ founder, onRemove }) => {
  if (!founder.contributions?.length) {
    return (
      <div className="text-center py-6 text-gray-500">
        No contributions recorded yet
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-3">
      {founder.contributions.map((contribution) => (
        <motion.div
          key={contribution.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between bg-white p-3 rounded-md border shadow-sm"
        >
          <div className="flex-1">
            <div className="flex items-center">
              <div 
                className="w-2 h-2 rounded-full mr-2" 
                style={{ 
                  backgroundColor: contribution.type === 'cash' 
                    ? '#10B981' 
                    : contribution.type === 'time' 
                      ? '#6366F1' 
                      : '#F43F5E' 
                }} 
              />
              <span className="text-sm font-medium capitalize">
                {contribution.type}
                <span className="text-gray-500 ml-1">
                  ({contribution.type === 'cash' ? '$' : ''}
                  {contribution.amount}
                  {contribution.type === 'time' ? ' hours' : ''})
                </span>
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{contribution.description}</p>
            <p className="text-xs text-gray-400">
              {new Date(contribution.date).toLocaleDateString()}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-gray-400 hover:text-destructive"
            onClick={() => onRemove(contribution.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </motion.div>
      ))}
    </div>
  );
};

interface ContributionManagerProps {
  founder: Founder;
}

const ContributionManager: React.FC<ContributionManagerProps> = ({ founder }) => {
  const { addContribution, removeContribution, updateContributionWeights, contributionWeights } = useFounders();
  
  const handleAddContribution = (contribution: Omit<Contribution, 'id'>) => {
    addContribution(founder.id, contribution);
  };
  
  const handleRemoveContribution = (contributionId: string) => {
    removeContribution(founder.id, contributionId);
  };
  
  const handleWeightChange = (type: keyof ContributionWeights, value: number) => {
    updateContributionWeights({ [type]: value });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Manage Contributions</CardTitle>
      </CardHeader>
      <CardContent>
        <ContributionWeightControl 
          weights={contributionWeights} 
          onWeightChange={handleWeightChange} 
        />
        
        <div className="mt-6">
          <h3 className="font-medium mb-4">Add New Contribution</h3>
          <ContributionForm onSubmit={handleAddContribution} />
        </div>
        
        <div className="mt-6">
          <h3 className="font-medium mb-2">Contribution History</h3>
          <ContributionList 
            founder={founder} 
            onRemove={handleRemoveContribution} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ContributionManager;
