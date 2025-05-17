
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { AppState, DEFAULT_MILESTONES, Founder, FOUNDER_COLORS, Contribution, ContributionWeights, DEFAULT_CONTRIBUTION_WEIGHTS } from '../types';
import { toast } from 'sonner';

type AppAction =
  | { type: 'ADD_FOUNDER'; founder: Founder }
  | { type: 'UPDATE_FOUNDER'; founder: Founder }
  | { type: 'REMOVE_FOUNDER'; id: string }
  | { type: 'SET_FOUNDERS'; founders: Founder[] }
  | { type: 'UPDATE_EQUITY_PERCENTAGES' }
  | { type: 'SET_CURRENT_MILESTONE'; id: string }
  | { type: 'COMPLETE_MILESTONE'; id: string }
  | { type: 'SAVE_MILESTONE_HISTORY' }
  | { type: 'UPDATE_MILESTONE_WEIGHT'; id: string; weight: number }
  | { type: 'ADD_CONTRIBUTION'; founderId: string; contribution: Contribution }
  | { type: 'REMOVE_CONTRIBUTION'; founderId: string; contributionId: string }
  | { type: 'UPDATE_CONTRIBUTION_WEIGHTS'; weights: Partial<ContributionWeights> }
  | { type: 'RESET_APP' };

const initialState: AppState = {
  founders: [],
  milestones: DEFAULT_MILESTONES,
  currentMilestoneId: 'initial',
  contributionWeights: DEFAULT_CONTRIBUTION_WEIGHTS,
  history: [],
};

const LOCAL_STORAGE_KEY = 'equity-growth-compass';

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_FOUNDER': {
      const colorIndex = state.founders.length % FOUNDER_COLORS.length;
      const founderWithColor = {
        ...action.founder,
        color: FOUNDER_COLORS[colorIndex]
      };
      return {
        ...state,
        founders: [...state.founders, founderWithColor],
      };
    }
    case 'UPDATE_FOUNDER':
      return {
        ...state,
        founders: state.founders.map((f) => (f.id === action.founder.id ? action.founder : f)),
      };
    case 'REMOVE_FOUNDER':
      return {
        ...state,
        founders: state.founders.filter((f) => f.id !== action.id),
      };
    case 'SET_FOUNDERS':
      return {
        ...state,
        founders: action.founders,
      };
    case 'ADD_CONTRIBUTION': {
      return {
        ...state,
        founders: state.founders.map(founder => 
          founder.id === action.founderId 
            ? {
                ...founder,
                contributions: [...(founder.contributions || []), action.contribution]
              }
            : founder
        ),
      };
    }
    case 'REMOVE_CONTRIBUTION': {
      return {
        ...state,
        founders: state.founders.map(founder => 
          founder.id === action.founderId 
            ? {
                ...founder,
                contributions: (founder.contributions || []).filter(c => c.id !== action.contributionId)
              }
            : founder
        ),
      };
    }
    case 'UPDATE_CONTRIBUTION_WEIGHTS': {
      return {
        ...state,
        contributionWeights: {
          ...state.contributionWeights,
          ...action.weights
        }
      };
    }
    case 'UPDATE_MILESTONE_WEIGHT': {
      return {
        ...state,
        milestones: state.milestones.map(milestone =>
          milestone.id === action.id
            ? { ...milestone, weight: action.weight }
            : milestone
        ),
      };
    }
    case 'UPDATE_EQUITY_PERCENTAGES': {
      if (state.founders.length === 0) return state;

      // Calculate weighted scores based on contribution types and milestone weights
      const currentMilestone = state.milestones.find(m => m.id === state.currentMilestoneId);
      const milestoneWeight = currentMilestone?.weight || 1;

      let totalScores = 0;
      
      const foundersWithScores = state.founders.map(founder => {
        // Calculate base score from criteria
        const criteriaScore = Object.values(founder.scores).reduce((sum, score) => sum + score, 0);
        
        // Calculate contribution score
        let contributionScore = 0;
        if (founder.contributions && founder.contributions.length > 0) {
          contributionScore = founder.contributions.reduce((sum, contribution) => {
            const typeWeight = state.contributionWeights[contribution.type] || 1;
            return sum + (contribution.amount * typeWeight);
          }, 0);
        }
        
        // Combine scores with milestone weighting
        const totalScore = (criteriaScore + contributionScore) * milestoneWeight;
        totalScores += totalScore;
        
        return {
          ...founder,
          weightedScore: totalScore
        };
      });

      if (totalScores === 0) return state;

      const updatedFounders = foundersWithScores.map(founder => {
        const equityPercentage = (founder.weightedScore / totalScores) * 100;
        return {
          ...founder,
          equityPercentage,
        };
      });

      return {
        ...state,
        founders: updatedFounders,
      };
    }
    case 'SET_CURRENT_MILESTONE':
      return {
        ...state,
        milestones: state.milestones.map(milestone => ({
          ...milestone,
          current: milestone.id === action.id,
        })),
        currentMilestoneId: action.id,
      };
    case 'COMPLETE_MILESTONE':
      return {
        ...state,
        milestones: state.milestones.map(milestone => {
          if (milestone.id === action.id) {
            return { ...milestone, completed: true, current: false };
          }
          const nextMilestoneIndex = state.milestones.findIndex(m => m.id === action.id) + 1;
          if (nextMilestoneIndex < state.milestones.length && 
              milestone.id === state.milestones[nextMilestoneIndex].id) {
            return { ...milestone, current: true };
          }
          return milestone;
        }),
        currentMilestoneId: (() => {
          const nextMilestoneIndex = state.milestones.findIndex(m => m.id === action.id) + 1;
          return nextMilestoneIndex < state.milestones.length ? 
            state.milestones[nextMilestoneIndex].id : state.currentMilestoneId;
        })(),
      };
    case 'SAVE_MILESTONE_HISTORY': {
      const currentMilestone = state.milestones.find(m => m.id === state.currentMilestoneId);
      if (!currentMilestone) return state;

      const historyEntry = {
        milestoneId: state.currentMilestoneId,
        milestoneName: currentMilestone.name,
        date: new Date().toISOString(),
        founders: JSON.parse(JSON.stringify(state.founders)) as Founder[],
      };

      return {
        ...state,
        history: [...state.history, historyEntry],
      };
    }
    case 'RESET_APP':
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      return initialState;
    default:
      return state;
  }
}

type AppContextType = {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState, () => {
    try {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        if (parsedState && 
            typeof parsedState === 'object' && 
            Array.isArray(parsedState.founders) && 
            Array.isArray(parsedState.milestones)) {
          // Migrate old data structure if needed
          if (!parsedState.contributionWeights) {
            parsedState.contributionWeights = DEFAULT_CONTRIBUTION_WEIGHTS;
          }
          
          // Ensure founders have contributions array
          parsedState.founders = parsedState.founders.map((founder: any) => ({
            ...founder,
            contributions: founder.contributions || []
          }));
          
          // Ensure milestones have weights
          parsedState.milestones = parsedState.milestones.map((milestone: any, index: number) => ({
            ...milestone,
            weight: milestone.weight !== undefined ? milestone.weight : 1
          }));
          
          return parsedState as AppState;
        }
      }
    } catch (error) {
      console.error('Error loading state from localStorage:', error);
    }
    return initialState;
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving state to localStorage:', error);
      toast.error('Failed to save your progress. Please check your browser storage settings.');
    }
  }, [state]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const useFounders = () => {
  const { state, dispatch } = useAppContext();
  
  const addFounder = (founder: Omit<Founder, 'id' | 'equityPercentage' | 'color' | 'contributions'>) => {
    const newFounder: Founder = {
      ...founder,
      id: Date.now().toString(),
      equityPercentage: 0,
      color: '#000000', // This will be overridden in the reducer
      contributions: [],
    };
    dispatch({ type: 'ADD_FOUNDER', founder: newFounder });
    dispatch({ type: 'UPDATE_EQUITY_PERCENTAGES' });
    toast.success(`${founder.name} added as a co-founder`);
  };

  const updateFounder = (founder: Founder) => {
    dispatch({ type: 'UPDATE_FOUNDER', founder });
    dispatch({ type: 'UPDATE_EQUITY_PERCENTAGES' });
  };

  const removeFounder = (id: string) => {
    dispatch({ type: 'REMOVE_FOUNDER', id });
    dispatch({ type: 'UPDATE_EQUITY_PERCENTAGES' });
    toast.info('Co-founder removed');
  };

  const addContribution = (founderId: string, contribution: Omit<Contribution, 'id'>) => {
    const newContribution: Contribution = {
      ...contribution,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_CONTRIBUTION', founderId, contribution: newContribution });
    dispatch({ type: 'UPDATE_EQUITY_PERCENTAGES' });
    toast.success('Contribution added');
  };

  const removeContribution = (founderId: string, contributionId: string) => {
    dispatch({ type: 'REMOVE_CONTRIBUTION', founderId, contributionId });
    dispatch({ type: 'UPDATE_EQUITY_PERCENTAGES' });
    toast.info('Contribution removed');
  };

  const updateContributionWeights = (weights: Partial<ContributionWeights>) => {
    dispatch({ type: 'UPDATE_CONTRIBUTION_WEIGHTS', weights });
    dispatch({ type: 'UPDATE_EQUITY_PERCENTAGES' });
    toast.success('Contribution weights updated');
  };

  return {
    founders: state.founders,
    contributionWeights: state.contributionWeights,
    addFounder,
    updateFounder,
    removeFounder,
    addContribution,
    removeContribution,
    updateContributionWeights,
  };
};

export const useMilestones = () => {
  const { state, dispatch } = useAppContext();
  
  const setCurrentMilestone = (id: string) => {
    dispatch({ type: 'SET_CURRENT_MILESTONE', id });
    toast.info(`Switched to ${state.milestones.find(m => m.id === id)?.name} milestone`);
  };

  const completeMilestone = (id: string) => {
    dispatch({ type: 'COMPLETE_MILESTONE', id });
    dispatch({ type: 'SAVE_MILESTONE_HISTORY' });
    toast.success(`${state.milestones.find(m => m.id === id)?.name} milestone completed`);
  };

  const updateMilestoneWeight = (id: string, weight: number) => {
    dispatch({ type: 'UPDATE_MILESTONE_WEIGHT', id, weight });
    dispatch({ type: 'UPDATE_EQUITY_PERCENTAGES' });
    toast.success('Milestone weight updated');
  };

  const resetApp = () => {
    dispatch({ type: 'RESET_APP' });
    toast.info('Application data has been reset');
  };

  return {
    milestones: state.milestones,
    currentMilestone: state.milestones.find(m => m.id === state.currentMilestoneId),
    history: state.history,
    setCurrentMilestone,
    completeMilestone,
    updateMilestoneWeight,
    resetApp,
  };
};
