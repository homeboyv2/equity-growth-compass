
import { AppState, Contribution } from '../types';

/**
 * Generates and downloads an HTML report of the equity distribution
 */
export const downloadHTML = (state: AppState): void => {
  const { founders, history, milestones, contributionWeights } = state;
  
  // Calculate total scores
  const totalScores = founders.reduce((total, founder) => {
    const criteriaScore = Object.values(founder.scores).reduce((sum, score) => sum + score, 0);
    let contributionScore = 0;
    if (founder.contributions?.length > 0) {
      contributionScore = founder.contributions.reduce((sum, contribution) => {
        const typeWeight = contributionWeights[contribution.type] || 1;
        return sum + (contribution.amount * typeWeight);
      }, 0);
    }
    return total + criteriaScore + contributionScore;
  }, 0);
  
  const averageScore = founders.length ? (totalScores / founders.length).toFixed(1) : "0";

  // Generate HTML content
  let htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Equity Distribution Report</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
        }
        h1 {
          color: #5a32a8;
          border-bottom: 2px solid #5a32a8;
          padding-bottom: 10px;
        }
        h2 {
          color: #5a32a8;
          margin-top: 30px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th {
          background-color: #5a32a8;
          color: white;
          text-align: left;
          padding: 10px;
        }
        td {
          padding: 8px 10px;
          border-bottom: 1px solid #ddd;
        }
        tr:nth-child(even) {
          background-color: #f2f2f2;
        }
        .summary-cards {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
        }
        .summary-card {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 15px;
          flex: 1;
        }
        .summary-card p {
          margin: 0;
          font-size: 14px;
          color: #6c757d;
        }
        .summary-card .value {
          font-size: 24px;
          font-weight: bold;
          color: #5a32a8;
          margin-top: 5px;
        }
        .founder-tag {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 16px;
          margin-right: 8px;
          margin-bottom: 8px;
          font-size: 14px;
        }
        .completed {
          color: green;
        }
        .in-progress {
          color: blue;
        }
        .pending {
          color: #666;
        }
        .badge {
          display: inline-block;
          font-size: 12px;
          padding: 3px 8px;
          border-radius: 12px;
          margin-right: 4px;
        }
        .badge.cash {
          background-color: rgba(16, 185, 129, 0.1);
          color: rgb(16, 185, 129);
        }
        .badge.time {
          background-color: rgba(99, 102, 241, 0.1);
          color: rgb(99, 102, 241);
        }
        .badge.skills {
          background-color: rgba(244, 63, 94, 0.1);
          color: rgb(244, 63, 94);
        }
        footer {
          margin-top: 40px;
          border-top: 1px solid #ddd;
          padding-top: 10px;
          font-size: 12px;
          color: #999;
        }
      </style>
    </head>
    <body>
      <h1>Startup Equity Distribution Report</h1>
      <p>Generated on ${new Date().toLocaleDateString()}</p>
      
      <h2>Current Equity Distribution</h2>
      <table>
        <thead>
          <tr>
            <th>Co-founder</th>
            <th>Role</th>
            <th>Equity</th>
          </tr>
        </thead>
        <tbody>
  `;
  
  // Add current equity data
  founders.forEach(founder => {
    htmlContent += `
          <tr>
            <td>
              <div style="display: flex; align-items: center; gap: 8px;">
                <div style="width: 12px; height: 12px; border-radius: 50%; background-color: ${founder.color};"></div>
                ${founder.name}
              </div>
            </td>
            <td>${founder.role}</td>
            <td><strong>${founder.equityPercentage.toFixed(2)}%</strong></td>
          </tr>
    `;
  });
  
  htmlContent += `
        </tbody>
      </table>
      
      <h2>Global Score Summary</h2>
      <div class="summary-cards">
        <div class="summary-card">
          <p>Total Team Score</p>
          <div class="value">${totalScores}</div>
        </div>
        <div class="summary-card">
          <p>Average Founder Score</p>
          <div class="value">${averageScore}</div>
        </div>
      </div>
  `;

  // Add milestone weights section
  htmlContent += `
    <h2>Milestone Weights</h2>
    <p>How each growth stage impacts equity calculations:</p>
    <table>
      <thead>
        <tr>
          <th>Milestone</th>
          <th>Status</th>
          <th>Weight</th>
        </tr>
      </thead>
      <tbody>
  `;

  milestones.forEach(milestone => {
    const status = milestone.completed ? 'Completed' : (milestone.current ? 'In Progress' : 'Pending');
    const statusClass = milestone.completed ? 'completed' : (milestone.current ? 'in-progress' : 'pending');
    
    htmlContent += `
      <tr>
        <td>${milestone.name}</td>
        <td class="${statusClass}">${status}</td>
        <td><strong>${milestone.weight.toFixed(1)}x</strong></td>
      </tr>
    `;
  });

  htmlContent += `
      </tbody>
    </table>

    <h2>Contribution Type Weights</h2>
    <p>How different contribution types impact equity calculations:</p>
    <table>
      <thead>
        <tr>
          <th>Contribution Type</th>
          <th>Weight Multiplier</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Cash Investment</td>
          <td><strong>${contributionWeights.cash.toFixed(1)}x</strong></td>
        </tr>
        <tr>
          <td>Time Contribution</td>
          <td><strong>${contributionWeights.time.toFixed(1)}x</strong></td>
        </tr>
        <tr>
          <td>Skills/Resources</td>
          <td><strong>${contributionWeights.skills.toFixed(1)}x</strong></td>
        </tr>
      </tbody>
    </table>
  `;
  
  // Detailed scoring for each founder
  htmlContent += `<h2>Detailed Scoring</h2>`;
  
  founders.forEach(founder => {
    const totalFounderScore = Object.values(founder.scores).reduce((sum, score) => sum + score, 0);
    
    htmlContent += `
      <h3 style="color: ${founder.color};">${founder.name} - ${founder.role}</h3>
      <table>
        <thead>
          <tr>
            <th>Criterion</th>
            <th>Score (0-10)</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    const criteria = [
      { name: "Role in Project", score: founder.scores.role },
      { name: "Usefulness", score: founder.scores.usefulness },
      { name: "Idea Contribution", score: founder.scores.ideaContribution },
      { name: "Business Plan", score: founder.scores.businessPlan },
      { name: "Domain Expertise", score: founder.scores.expertise },
      { name: "Commitment & Risk", score: founder.scores.commitment },
      { name: "Operations", score: founder.scores.operations }
    ];
    
    criteria.forEach(criterion => {
      const percentage = totalFounderScore ? ((criterion.score / totalFounderScore) * 100).toFixed(1) : "0";
      htmlContent += `
        <tr>
          <td>${criterion.name}</td>
          <td>${criterion.score}</td>
          <td>${percentage}%</td>
        </tr>
      `;
    });
    
    htmlContent += `
        <tr>
          <td><strong>Total Score</strong></td>
          <td><strong>${totalFounderScore}</strong></td>
          <td><strong>100%</strong></td>
        </tr>
      </tbody>
    </table>
    `;

    // Add contributions section for each founder
    if (founder.contributions && founder.contributions.length > 0) {
      htmlContent += `
        <h4>Additional Contributions</h4>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
      `;

      // Group contributions by type
      const groupedContributions: Record<string, Contribution[]> = {
        cash: [],
        time: [],
        skills: []
      };

      founder.contributions.forEach(contribution => {
        if (!groupedContributions[contribution.type]) {
          groupedContributions[contribution.type] = [];
        }
        groupedContributions[contribution.type].push(contribution);
      });

      // Add rows for each contribution
      Object.entries(groupedContributions).forEach(([type, contributions]) => {
        if (contributions.length > 0) {
          contributions.forEach(contribution => {
            htmlContent += `
              <tr>
                <td>
                  <span class="badge ${type}">
                    ${type.charAt(0).toUpperCase() + type.slice(1)}
                  </span>
                </td>
                <td>
                  ${type === 'cash' ? '$' : ''}${contribution.amount}${type === 'time' ? ' hours' : ''}
                </td>
                <td>${contribution.description}</td>
                <td>${new Date(contribution.date).toLocaleDateString()}</td>
              </tr>
            `;
          });
        }
      });

      // Calculate contribution totals
      const contributionTotals = {
        cash: founder.contributions.filter(c => c.type === 'cash').reduce((sum, c) => sum + c.amount, 0),
        time: founder.contributions.filter(c => c.type === 'time').reduce((sum, c) => sum + c.amount, 0),
        skills: founder.contributions.filter(c => c.type === 'skills').reduce((sum, c) => sum + c.amount, 0)
      };

      htmlContent += `
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4">
                <strong>Totals:</strong>
                ${contributionTotals.cash > 0 ? `<span class="badge cash">$${contributionTotals.cash.toLocaleString()}</span>` : ''}
                ${contributionTotals.time > 0 ? `<span class="badge time">${contributionTotals.time.toLocaleString()} hours</span>` : ''}
                ${contributionTotals.skills > 0 ? `<span class="badge skills">${contributionTotals.skills.toLocaleString()} units</span>` : ''}
              </td>
            </tr>
          </tfoot>
        </table>
      `;
    }

    // Add equity allocation footer
    htmlContent += `
      <table>
        <tfoot>
          <tr style="background-color: #5a32a8; color: white;">
            <td><strong>Equity Allocation</strong></td>
            <td></td>
            <td><strong>${founder.equityPercentage.toFixed(2)}%</strong></td>
          </tr>
        </tfoot>
      </table>
    `;
  });
  
  // Equity Evolution History
  if (history.length > 0) {
    htmlContent += `
      <h2>Equity Evolution History</h2>
    `;
    
    history.forEach(entry => {
      htmlContent += `
        <h3>Milestone: ${entry.milestoneName} - ${new Date(entry.date).toLocaleDateString()}</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px;">
      `;
      
      entry.founders.forEach(founder => {
        htmlContent += `
          <div class="founder-tag" style="background-color: ${founder.color}20; color: ${founder.color};">
            ${founder.name}: ${founder.equityPercentage.toFixed(2)}%
          </div>
        `;
      });
      
      htmlContent += `</div>`;
    });
  }
  
  // Progress Overview
  const completedMilestones = milestones.filter(m => m.completed);
  if (completedMilestones.length > 0 || milestones.some(m => m.current)) {
    htmlContent += `
      <h2>Startup Progress</h2>
      <table>
        <thead>
          <tr>
            <th>Milestone</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    milestones.forEach(milestone => {
      const status = milestone.completed ? 'Completed' : (milestone.current ? 'In Progress' : 'Pending');
      const statusClass = milestone.completed ? 'completed' : (milestone.current ? 'in-progress' : 'pending');
      
      htmlContent += `
        <tr>
          <td>${milestone.name}</td>
          <td class="${statusClass}">${status}</td>
        </tr>
      `;
    });
    
    htmlContent += `
        </tbody>
      </table>
    `;
  }
  
  // Footer
  htmlContent += `
      <footer>
        <p>Generated by Equity Growth Compass | This document is for informational purposes only.</p>
      </footer>
    </body>
    </html>
  `;
  
  // Create and trigger download
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'equity-growth-compass-report.html';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
