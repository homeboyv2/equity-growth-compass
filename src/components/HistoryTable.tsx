
import React, { useState } from 'react';
import { useMilestones } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { generatePDF } from '@/utils/pdfExport';
import { useAppContext } from '@/context/AppContext';
import { FileDown, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

const HistoryTable: React.FC = () => {
  const { history } = useMilestones();
  const { state } = useAppContext();
  const [expanded, setExpanded] = useState(false);
  
  if (history.length === 0) {
    return null;
  }

  const handleExportPDF = () => {
    try {
      generatePDF(state);
      toast.success('PDF report generated successfully');
    } catch (error) {
      toast.error('Failed to generate PDF report');
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Equity Evolution History</h2>
        <Button 
          variant="outline"
          size="sm"
          onClick={handleExportPDF}
          className="flex items-center gap-1"
        >
          <FileDown className="h-4 w-4" />
          <span>Export PDF</span>
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Milestone
              </th>
              <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Equity Distribution
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {history
              .slice(0, expanded ? undefined : 3)
              .map((entry, index) => (
                <tr key={`${entry.milestoneId}-${index}`}>
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {entry.milestoneName}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(entry.date).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex flex-wrap gap-2">
                      {entry.founders.map(founder => (
                        <div 
                          key={founder.id}
                          className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs"
                          style={{ backgroundColor: `${founder.color}20`, color: founder.color }}
                        >
                          <span className="font-medium">{founder.name}</span>
                          <span>{founder.equityPercentage.toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
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
              <>
                <ChevronUp className="h-3 w-3 mr-1" /> Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 mr-1" /> Show All ({history.length})
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default HistoryTable;
