
import { AppState, Founder } from '../types';

/**
 * Generates clean HTML for exporting equity distribution data
 */
export const generateHTML = (state: AppState): string => {
  const { founders, history, milestones } = state;

  // Create HTML template with CSS for styling
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Startup Equity Distribution Report</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1100px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      color: #5a32a8;
      text-align: center;
      font-size: 28px;
      margin-bottom: 10px;
    }
    h2 {
      color: #5a32a8;
      font-size: 20px;
      margin-top: 30px;
      border-bottom: 1px solid #eee;
      padding-bottom: 8px;
    }
    .date {
      text-align: center;
      color: #666;
      margin-bottom: 30px;
      font-size: 14px;
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
      border-bottom: 1px solid #eee;
    }
    tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin: 20px 0;
    }
    .summary-card {
      background-color: #f5f5f5;
      padding: 15px;
      border-radius: 8px;
    }
    .summary-card p {
      margin: 5px 0;
    }
    .summary-card .number {
      font-size: 24px;
      font-weight: bold;
      color: #5a32a8;
    }
    .summary-card .label {
      font-size: 14px;
      color: #666;
    }
    .footer {
      margin-top: 50px;
      text-align: center;
      font-size: 12px;
      color: #999;
      border-top: 1px solid #eee;
      padding-top: 20px;
    }
    .chip {
      display: inline-block;
      padding: 3px 12px;
      border-radius: 16px;
      font-size: 14px;
      margin-right: 8px;
      margin-bottom: 5px;
    }
    .status {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 13px;
      font-weight: 500;
    }
    .completed {
      background-color: #e6f4ea;
      color: #137333;
    }
    .in-progress {
      background-color: #e8f0fe;
      color: #1967d2;
    }
    .pending {
      background-color: #f1f3f4;
      color: #5f6368;
    }
  </style>
</head>
<body>
  <h1>Startup Equity Distribution Report</h1>
  <p class="date">Generated on: ${new Date().toLocaleDateString()}</p>
  
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
      ${founders.map(founder => `
        <tr>
          <td>
            <div style="display: flex; align-items: center;">
              <div style="width: 12px; height: 12px; border-radius: 50%; background-color: ${founder.color}; margin-right: 8px;"></div>
              ${founder.name}
            </div>
          </td>
          <td>${founder.role}</td>
          <td><strong>${founder.equityPercentage.toFixed(2)}%</strong></td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  
  <h2>Global Score Summary</h2>
  <div class="summary">
    <div class="summary-card">
      <p class="label">Total Team Score</p>
      <p class="number">${founders.reduce((total, founder) => {
        return total + Object.values(founder.scores).reduce((sum, score) => sum + score, 0);
      }, 0)}</p>
    </div>
    <div class="summary-card">
      <p class="label">Average Founder Score</p>
      <p class="number">${founders.length 
        ? (founders.reduce((total, founder) => {
            return total + Object.values(founder.scores).reduce((sum, score) => sum + score, 0);
          }, 0) / founders.length).toFixed(1) 
        : "0"}</p>
    </div>
  </div>
  
  <h2>Detailed Scoring</h2>
  ${founders.map(founder => {
    const totalFounderScore = Object.values(founder.scores).reduce((sum, score) => sum + score, 0);
    
    return `
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
          <tr>
            <td>Role in Project</td>
            <td>${founder.scores.role}</td>
            <td>${totalFounderScore ? ((founder.scores.role / totalFounderScore) * 100).toFixed(1) : "0"}%</td>
          </tr>
          <tr>
            <td>Usefulness</td>
            <td>${founder.scores.usefulness}</td>
            <td>${totalFounderScore ? ((founder.scores.usefulness / totalFounderScore) * 100).toFixed(1) : "0"}%</td>
          </tr>
          <tr>
            <td>Idea Contribution</td>
            <td>${founder.scores.ideaContribution}</td>
            <td>${totalFounderScore ? ((founder.scores.ideaContribution / totalFounderScore) * 100).toFixed(1) : "0"}%</td>
          </tr>
          <tr>
            <td>Business Plan</td>
            <td>${founder.scores.businessPlan}</td>
            <td>${totalFounderScore ? ((founder.scores.businessPlan / totalFounderScore) * 100).toFixed(1) : "0"}%</td>
          </tr>
          <tr>
            <td>Domain Expertise</td>
            <td>${founder.scores.expertise}</td>
            <td>${totalFounderScore ? ((founder.scores.expertise / totalFounderScore) * 100).toFixed(1) : "0"}%</td>
          </tr>
          <tr>
            <td>Commitment & Risk</td>
            <td>${founder.scores.commitment}</td>
            <td>${totalFounderScore ? ((founder.scores.commitment / totalFounderScore) * 100).toFixed(1) : "0"}%</td>
          </tr>
          <tr>
            <td>Operations</td>
            <td>${founder.scores.operations}</td>
            <td>${totalFounderScore ? ((founder.scores.operations / totalFounderScore) * 100).toFixed(1) : "0"}%</td>
          </tr>
          <tr>
            <td><strong>Total Score</strong></td>
            <td><strong>${totalFounderScore}</strong></td>
            <td><strong>100%</strong></td>
          </tr>
        </tbody>
        <tfoot>
          <tr style="background-color: #5a32a8; color: white;">
            <td colspan="2"><strong>Equity Allocation</strong></td>
            <td><strong>${founder.equityPercentage.toFixed(2)}%</strong></td>
          </tr>
        </tfoot>
      </table>
    `;
  }).join('')}
  
  ${history.length > 0 ? `
    <h2>Equity Evolution History</h2>
    ${history.map(entry => `
      <h3>Milestone: ${entry.milestoneName} - ${new Date(entry.date).toLocaleDateString()}</h3>
      <table>
        <thead>
          <tr>
            <th>Co-founder</th>
            <th>Equity %</th>
          </tr>
        </thead>
        <tbody>
          ${entry.founders.map(founder => `
            <tr>
              <td>${founder.name}</td>
              <td>${founder.equityPercentage.toFixed(2)}%</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `).join('')}
  ` : ''}
  
  <h2>Startup Progress</h2>
  <table>
    <thead>
      <tr>
        <th>Milestone</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${milestones.map(milestone => `
        <tr>
          <td>${milestone.name}</td>
          <td>
            <span class="status ${
              milestone.completed ? 'completed' : (milestone.current ? 'in-progress' : 'pending')
            }">
              ${milestone.completed ? 'Completed' : (milestone.current ? 'In Progress' : 'Pending')}
            </span>
          </td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  
  <div class="footer">
    <p>Generated by Equity Growth Compass | This document is for informational purposes only.</p>
  </div>
</body>
</html>
  `;

  return htmlContent;
};

/**
 * Creates a downloadable HTML file from the generated content
 */
export const downloadHTML = (state: AppState): void => {
  const htmlContent = generateHTML(state);
  
  // Create a Blob with the HTML content
  const blob = new Blob([htmlContent], { type: 'text/html' });
  
  // Create a URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Create a temporary link element
  const link = document.createElement('a');
  link.href = url;
  link.download = 'equity-growth-compass-report.html';
  
  // Append to the document body and click to trigger download
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
