
import React, { useState } from 'react';
import { useMilestones } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { downloadHTML } from '@/utils/htmlExport';
import { useAppContext } from '@/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FileDown, ChevronDown, ChevronUp, BarChart } from 'lucide-react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const HistoryTable: React.FC = () => {
  const { history } = useMilestones();
  const { state } = useAppContext();
  const [expanded, setExpanded] = useState(false);
  const [showGlobalSummary, setShowGlobalSummary] = useState(false);
  
  if (history.length === 0) {
    return null;
  }

  const handleExportHTML = () => {
    try {
      downloadHTML(state);
      toast.success('HTML report generated successfully');
    } catch (error) {
      toast.error('Failed to generate HTML report');
      console.error('Error generating HTML:', error);
    }
  };

  // Calculate global score summary
  const calculateGlobalScores = () => {
    if (!state.founders.length) return null;
    
    const totalScores = state.founders.reduce((total, founder) => {
      return total + Object.values(founder.scores).reduce((sum, score) => sum + score, 0);
    }, 0);
    
    return {
      total: totalScores,
      average: totalScores / state.founders.length,
      founders: state.founders.map(founder => ({
        id: founder.id,
        name: founder.name,
        role: founder.role,
        color: founder.color,
        totalScore: Object.values(founder.scores).reduce((sum, score) => sum + score, 0),
        equityPercentage: founder.equityPercentage
      }))
    };
  };

  const globalScores = calculateGlobalScores();

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-sm p-6 border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Equity Evolution History</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => setShowGlobalSummary(!showGlobalSummary)}
            className="flex items-center gap-1"
          >
            <BarChart className="h-4 w-4" />
            <span>{showGlobalSummary ? 'Hide Summary' : 'Show Summary'}</span>
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={handleExportHTML}
            className="flex items-center gap-1"
          >
            <FileDown className="h-4 w-4" />
            <span>Export HTML</span>
          </Button>
        </div>
      </div>
      
      <AnimatePresence>
        {showGlobalSummary && globalScores && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-md font-semibold mb-3">Global Score Summary</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-white rounded-md shadow-sm">
                  <p className="text-sm text-gray-500">Total Team Score</p>
                  <p className="text-xl font-bold">{globalScores.total}</p>
                </div>
                <div className="p-3 bg-white rounded-md shadow-sm">
                  <p className="text-sm text-gray-500">Average Founder Score</p>
                  <p className="text-xl font-bold">{globalScores.average.toFixed(1)}</p>
                </div>
              </div>
              
              <h4 className="text-sm font-medium mb-2">Current Equity Distribution</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Co-founder</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Total Score</TableHead>
                    <TableHead className="text-right">Equity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {globalScores.founders.map(founder => (
                    <TableRow key={founder.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: founder.color }}></div>
                          {founder.name}
                        </div>
                      </TableCell>
                      <TableCell>{founder.role}</TableCell>
                      <TableCell className="text-right">{founder.totalScore}</TableCell>
                      <TableCell className="text-right font-bold">{founder.equityPercentage.toFixed(2)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Milestone</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Equity Distribution</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history
              .slice(0, expanded ? undefined : 3)
              .map((entry, index) => (
                <TableRow key={`${entry.milestoneId}-${index}`}>
                  <TableCell className="font-medium">
                    {entry.milestoneName}
                  </TableCell>
                  <TableCell>
                    {new Date(entry.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {entry.founders.map(founder => (
                        <motion.div 
                          key={founder.id}
                          className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs"
                          style={{ backgroundColor: `${founder.color}20`, color: founder.color }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <span className="font-medium">{founder.name}</span>
                          <span>{founder.equityPercentage.toFixed(1)}%</span>
                        </motion.div>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      
      {history.length > 3 && (
        <div className="mt-4 flex justify-center">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="text-xs flex items-center"
          >
            {expanded ? (
              <motion.div className="flex items-center" initial={{ y: 0 }} animate={{ y: [0, -2, 0] }} transition={{ repeat: 3, duration: 0.5 }}>
                <ChevronUp className="h-3 w-3 mr-1" /> Show Less
              </motion.div>
            ) : (
              <motion.div className="flex items-center" initial={{ y: 0 }} animate={{ y: [0, 2, 0] }} transition={{ repeat: 3, duration: 0.5 }}>
                <ChevronDown className="h-3 w-3 mr-1" /> Show All ({history.length})
              </motion.div>
            )}
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default HistoryTable;
