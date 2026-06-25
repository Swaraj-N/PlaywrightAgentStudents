#!/usr/bin/env node

/**
 * Test Result Analyzer
 * Generates comprehensive test execution analysis reports from Playwright results
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import xml2js from 'xml2js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class TestResultAnalyzer {
  constructor() {
    this.reportPath = 'playwright-report/index.html';
    this.xmlPath = 'test-results/results.xml';
    this.outputDir = 'test-results';
    this.failures = [];
    this.summary = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      failuresByType: {},
      failuresByFile: {}
    };
  }

  /**
   * Parse XML results file
   */
  async parseXMLResults() {
    try {
      if (!fs.existsSync(this.xmlPath)) {
        console.warn(`⚠️  XML file not found: ${this.xmlPath}`);
        return { testsuite: [] };
      }

      const xml = fs.readFileSync(this.xmlPath, 'utf-8');
      const parser = new xml2js.Parser();
      const result = await parser.parseStringPromise(xml);
      return result;
    } catch (error) {
      console.error('Error parsing XML:', error.message);
      return { testsuite: [] };
    }
  }

  /**
   * Extract failure information from XML
   */
  extractFailures(xmlData) {
    const testsuites = xmlData.testsuites ? xmlData.testsuites.testsuite : [];
    
    testsuites.forEach(suite => {
      const suiteName = suite.$.name || 'Unknown';
      const testcases = suite.testcase || [];

      testcases.forEach(testcase => {
        this.summary.total++;
        const testName = testcase.$.name;
        
        if (testcase.failure) {
          this.summary.failed++;
          const failure = testcase.failure[0];
          const errorMessage = failure._ || '';
          const errorType = this.classifyError(errorMessage, testcase);

          // Extract selector information
          const selectorInfo = this.extractSelectorInfo(errorMessage);

          this.failures.push({
            testName,
            file: suiteName,
            status: 'failed',
            duration: testcase.$.time || '0',
            errorType,
            errorMessage: errorMessage.substring(0, 500),
            selectorInfo,
            logs: testcase['system-out'] ? testcase['system-out'][0] : '',
            fullError: errorMessage,
            suggestion: this.generateSuggestion(errorType, selectorInfo, errorMessage)
          });

          // Track by type
          this.summary.failuresByType[errorType] = (this.summary.failuresByType[errorType] || 0) + 1;
          
          // Track by file
          this.summary.failuresByFile[suiteName] = (this.summary.failuresByFile[suiteName] || 0) + 1;
        } else if (testcase.skipped) {
          this.summary.skipped++;
        } else {
          this.summary.passed++;
        }
      });
    });
  }

  /**
   * Classify error type
   */
  classifyError(errorMessage, testcase) {
    const msg = errorMessage.toLowerCase();

    if (msg.includes('locator') && msg.includes('no element matches')) {
      return 'SELECTOR_NOT_FOUND';
    }
    if (msg.includes('timeout') || msg.includes('waiting for')) {
      return 'TIMEOUT';
    }
    if (msg.includes('target page') && msg.includes('closed')) {
      return 'PAGE_CLOSED';
    }
    if (msg.includes('navigation')) {
      return 'NAVIGATION_ERROR';
    }
    if (msg.includes('assert')) {
      return 'ASSERTION_FAILED';
    }
    if (msg.includes('auth') || msg.includes('password') || msg.includes('login')) {
      return 'AUTH_FAILURE';
    }
    if (msg.includes('network') || msg.includes('econnrefused')) {
      return 'NETWORK_ERROR';
    }
    
    return 'UNKNOWN_ERROR';
  }

  /**
   * Extract selector information from error message
   */
  extractSelectorInfo(errorMessage) {
    const selectorMatch = errorMessage.match(/locator\('([^']+)'\)|selector[\s:]+([^\s]+)|#(\w+)|\.(\w+)/i);
    const actionMatch = errorMessage.match(/\.(click|fill|hover|press|select|type)\(/i);

    return {
      selector: selectorMatch ? (selectorMatch[1] || selectorMatch[2] || selectorMatch[3] || selectorMatch[4]) : 'Unknown',
      type: this.determineSelectorType(selectorMatch),
      action: actionMatch ? actionMatch[1] : 'Unknown',
      found: !errorMessage.includes('no element matches')
    };
  }

  /**
   * Determine selector type
   */
  determineSelectorType(match) {
    if (!match) return 'Unknown';
    if (match[3]) return 'ID';
    if (match[4]) return 'Class';
    if (match[0].includes('//')) return 'XPath';
    return 'CSS';
  }

  /**
   * Generate contextual suggestion
   */
  generateSuggestion(errorType, selectorInfo, errorMessage) {
    const suggestions = {
      SELECTOR_NOT_FOUND: [
        `Verify selector "${selectorInfo.selector}" still exists in current app version`,
        'Check for dynamic DOM changes or element visibility',
        'Add explicit waits: page.waitForSelector()',
        `Consider using data-testid attributes for stable selectors`,
        'Review recent application changes that might affect selectors'
      ],
      TIMEOUT: [
        'Increase timeout: await page.locator(...).click({ timeout: 60000 })',
        'Add page.waitForLoadState("networkidle") before interaction',
        'Check browser console for errors',
        'Verify network connectivity and API responses'
      ],
      PAGE_CLOSED: [
        'Check for unexpected page navigation',
        'Verify authentication token is still valid',
        'Check if page was closed by navigation or other action',
        'Add better error handling and logging'
      ],
      NAVIGATION_ERROR: [
        'Verify target URL is accessible',
        'Check for redirect loops',
        'Wait for navigation: await page.waitForNavigation()',
        'Check network tab for failed requests'
      ],
      ASSERTION_FAILED: [
        'Verify expected value matches actual result',
        'Check data source for correct test data',
        'Review assertion logic',
        'Add debugging logs to see actual values'
      ],
      AUTH_FAILURE: [
        'Verify credentials are correct',
        'Check authentication endpoint',
        'Verify session/token handling',
        'Check authentication policy changes'
      ],
      NETWORK_ERROR: [
        'Verify network connectivity',
        'Check API endpoint availability',
        'Review CORS settings',
        'Check firewall/proxy configuration'
      ]
    };

    return suggestions[errorType] || suggestions['UNKNOWN_ERROR'] || [
      'Review error message carefully',
      'Check application logs',
      'Verify test environment configuration'
    ];
  }

  /**
   * Generate HTML report
   */
  generateHTMLReport() {
    const failureRate = this.summary.total > 0 
      ? ((this.summary.failed / this.summary.total) * 100).toFixed(2) 
      : 0;

    const failuresByTypeChart = this.generateFailureChart();
    const failuresByFileChart = this.generateFileChart();
    const failuresList = this.generateFailuresList();

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Execution Analysis Report</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 1.1em;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px;
        }
        
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        
        .summary-card {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding: 25px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        
        .summary-card:hover {
            transform: translateY(-5px);
        }
        
        .summary-card .number {
            font-size: 2.5em;
            font-weight: bold;
            margin: 10px 0;
        }
        
        .summary-card.passed .number {
            color: #27ae60;
        }
        
        .summary-card.failed .number {
            color: #e74c3c;
        }
        
        .summary-card.skipped .number {
            color: #f39c12;
        }
        
        .summary-card.total .number {
            color: #3498db;
        }
        
        .section {
            margin-bottom: 50px;
        }
        
        .section h2 {
            color: #333;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 3px solid #667eea;
            font-size: 1.8em;
        }
        
        .charts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 30px;
            margin-bottom: 30px;
        }
        
        .chart-container {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        
        .chart-container h3 {
            color: #555;
            margin-bottom: 20px;
            font-size: 1.3em;
        }
        
        .chart-wrapper {
            position: relative;
            height: 300px;
        }
        
        .failure-item {
            background: #f8f9fa;
            border-left: 4px solid #e74c3c;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 5px;
            transition: all 0.3s ease;
        }
        
        .failure-item:hover {
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            transform: translateX(5px);
        }
        
        .failure-item.selector-error {
            border-left-color: #e74c3c;
        }
        
        .failure-item.timeout-error {
            border-left-color: #f39c12;
        }
        
        .failure-item.navigation-error {
            border-left-color: #9b59b6;
        }
        
        .failure-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .failure-name {
            font-size: 1.2em;
            font-weight: bold;
            color: #333;
        }
        
        .failure-type {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: bold;
            background: #e74c3c;
            color: white;
        }
        
        .failure-type.timeout {
            background: #f39c12;
        }
        
        .failure-type.navigation {
            background: #9b59b6;
        }
        
        .failure-details {
            margin: 15px 0;
            font-size: 0.95em;
            color: #666;
        }
        
        .detail-row {
            display: grid;
            grid-template-columns: 150px 1fr;
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px solid #e0e0e0;
        }
        
        .detail-row strong {
            color: #333;
        }
        
        .selector-info {
            background: #fff3cd;
            padding: 12px;
            border-radius: 5px;
            margin: 10px 0;
            border-left: 3px solid #f39c12;
        }
        
        .selector-info strong {
            color: #856404;
        }
        
        .suggestions {
            background: #d4edda;
            border-left: 3px solid #28a745;
            padding: 15px;
            border-radius: 5px;
            margin-top: 15px;
        }
        
        .suggestions h4 {
            color: #155724;
            margin-bottom: 10px;
        }
        
        .suggestions ul {
            list-style: none;
            padding-left: 0;
        }
        
        .suggestions li {
            color: #155724;
            padding: 5px 0;
            padding-left: 25px;
            position: relative;
        }
        
        .suggestions li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #28a745;
            font-weight: bold;
        }
        
        .error-stack {
            background: #f8d7da;
            border-left: 3px solid #dc3545;
            padding: 12px;
            border-radius: 5px;
            margin: 10px 0;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            color: #721c24;
            max-height: 200px;
            overflow-y: auto;
        }
        
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            border-top: 1px solid #e0e0e0;
        }
        
        .status-badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 0.8em;
            font-weight: bold;
            margin-left: 10px;
        }
        
        .status-badge.failed {
            background: #f8d7da;
            color: #721c24;
        }
        
        @media (max-width: 768px) {
            .summary-grid {
                grid-template-columns: 1fr 1fr;
            }
            
            .charts-grid {
                grid-template-columns: 1fr;
            }
            
            .detail-row {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧪 Test Execution Analysis Report</h1>
            <p>Comprehensive root cause analysis of test failures</p>
            <p style="font-size: 0.9em; margin-top: 10px;">Generated: ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="content">
            <!-- Summary Section -->
            <section class="summary-grid">
                <div class="summary-card total">
                    <div>Total Tests</div>
                    <div class="number">${this.summary.total}</div>
                </div>
                <div class="summary-card passed">
                    <div>Passed</div>
                    <div class="number">${this.summary.passed}</div>
                </div>
                <div class="summary-card failed">
                    <div>Failed</div>
                    <div class="number">${this.summary.failed}</div>
                </div>
                <div class="summary-card skipped">
                    <div>Skipped</div>
                    <div class="number">${this.summary.skipped}</div>
                </div>
            </section>
            
            <!-- Failure Rate -->
            <section class="section" style="margin-top: 30px;">
                <h3 style="font-size: 1.5em; color: #e74c3c;">
                    Failure Rate: <strong>${failureRate}%</strong>
                </h3>
            </section>
            
            <!-- Charts Section -->
            ${this.summary.failed > 0 ? `
            <section class="section">
                <h2>📊 Failure Analysis</h2>
                <div class="charts-grid">
                    <div class="chart-container">
                        <h3>Failures by Type</h3>
                        <div class="chart-wrapper">
                            <canvas id="failureTypeChart"></canvas>
                        </div>
                    </div>
                    <div class="chart-container">
                        <h3>Failures by Test File</h3>
                        <div class="chart-wrapper">
                            <canvas id="failureFileChart"></canvas>
                        </div>
                    </div>
                </div>
            </section>
            ` : ''}
            
            <!-- Detailed Failures Section -->
            ${this.failures.length > 0 ? `
            <section class="section">
                <h2>🔍 Detailed Failure Analysis</h2>
                ${failuresList}
            </section>
            ` : '<div style="padding: 20px; background: #d4edda; border-radius: 5px; text-align: center;"><p>✅ All tests passed! No failures to report.</p></div>'}
        </div>
        
        <div class="footer">
            <p>Test Result Analysis Tool | Powered by Playwright</p>
            <p style="font-size: 0.9em; margin-top: 10px;">For detailed test traces, check playwright-report/index.html</p>
        </div>
    </div>
    
    ${this.summary.failed > 0 ? `
    <script>
        // Failure Type Chart
        const failureTypeCtx = document.getElementById('failureTypeChart').getContext('2d');
        new Chart(failureTypeCtx, {
            type: 'doughnut',
            data: {
                labels: ${JSON.stringify(Object.keys(this.summary.failuresByType))},
                datasets: [{
                    data: ${JSON.stringify(Object.values(this.summary.failuresByType))},
                    backgroundColor: [
                        '#e74c3c', '#f39c12', '#9b59b6', '#3498db', '#e67e22', '#95a5a6', '#c0392b'
                    ],
                    borderColor: 'white',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { padding: 15, font: { size: 12 } }
                    }
                }
            }
        });
        
        // Failure File Chart
        const failureFileCtx = document.getElementById('failureFileChart').getContext('2d');
        new Chart(failureFileCtx, {
            type: 'bar',
            data: {
                labels: ${JSON.stringify(Object.keys(this.summary.failuresByFile))},
                datasets: [{
                    label: 'Failures',
                    data: ${JSON.stringify(Object.values(this.summary.failuresByFile))},
                    backgroundColor: '#e74c3c',
                    borderColor: '#c0392b',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: { display: true }
                },
                scales: {
                    x: { beginAtZero: true, max: Math.max(...${JSON.stringify(Object.values(this.summary.failuresByFile))}) + 1 }
                }
            }
        });
    </script>
    ` : ''}
</body>
</html>
    `;

    return html;
  }

  /**
   * Generate failure chart data
   */
  generateFailureChart() {
    return this.summary.failuresByType;
  }

  /**
   * Generate file chart data
   */
  generateFileChart() {
    return this.summary.failuresByFile;
  }

  /**
   * Generate failures list HTML
   */
  generateFailuresList() {
    return this.failures.map((failure, idx) => `
        <div class="failure-item ${failure.errorType.toLowerCase().replace('_', '-')}-error">
            <div class="failure-header">
                <span class="failure-name">#${idx + 1}: ${failure.testName}</span>
                <span class="failure-type ${failure.errorType === 'TIMEOUT' ? 'timeout' : failure.errorType === 'NAVIGATION_ERROR' ? 'navigation' : ''}">
                    ${failure.errorType.replace(/_/g, ' ')}
                </span>
            </div>
            
            <div class="failure-details">
                <div class="detail-row">
                    <strong>Test File:</strong>
                    <span>${failure.file}</span>
                </div>
                <div class="detail-row">
                    <strong>Duration:</strong>
                    <span>${failure.duration}s</span>
                </div>
            </div>
            
            ${failure.selectorInfo.selector !== 'Unknown' ? `
            <div class="selector-info">
                <strong>🎯 Selector Details:</strong><br>
                Selector: <code>${failure.selectorInfo.selector}</code><br>
                Type: ${failure.selectorInfo.type}<br>
                Action: ${failure.selectorInfo.action}
            </div>
            ` : ''}
            
            <div class="error-stack">
                <strong>Error Message:</strong><br>
                ${failure.errorMessage}
            </div>
            
            ${failure.suggestion.length > 0 ? `
            <div class="suggestions">
                <h4>💡 Recommendations:</h4>
                <ul>
                    ${failure.suggestion.map(s => `<li>${s}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
        </div>
    `).join('');
  }

  /**
   * Generate JSON summary
   */
  generateJSONSummary() {
    return {
      summary: this.summary,
      failures: this.failures,
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Generate CSV for selectors
   */
  generateSelectorCSV() {
    const header = 'Test Name,File,Selector,Type,Action,Status,Error Type\n';
    const rows = this.failures
      .filter(f => f.selectorInfo.selector !== 'Unknown')
      .map(f => `"${f.testName}","${f.file}","${f.selectorInfo.selector}","${f.selectorInfo.type}","${f.selectorInfo.action}","Failed","${f.errorType}"`)
      .join('\n');
    
    return header + rows;
  }

  /**
   * Write report files
   */
  writeReports() {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    // Write HTML report
    const htmlReport = this.generateHTMLReport();
    fs.writeFileSync(
      path.join(this.outputDir, 'analysis-report.html'),
      htmlReport
    );
    console.log('✅ HTML Report: test-results/analysis-report.html');

    // Write JSON summary
    const jsonSummary = this.generateJSONSummary();
    fs.writeFileSync(
      path.join(this.outputDir, 'analysis-summary.json'),
      JSON.stringify(jsonSummary, null, 2)
    );
    console.log('✅ JSON Summary: test-results/analysis-summary.json');

    // Write selector CSV
    const selectorCSV = this.generateSelectorCSV();
    if (selectorCSV.split('\n').length > 1) {
      fs.writeFileSync(
        path.join(this.outputDir, 'selector-mapping.csv'),
        selectorCSV
      );
      console.log('✅ Selector Mapping: test-results/selector-mapping.csv');
    }
  }

  /**
   * Run analysis
   */
  async run() {
    console.log('🔍 Analyzing test results...\n');

    const xmlData = await this.parseXMLResults();
    this.extractFailures(xmlData);

    console.log(`📊 Summary:`);
    console.log(`  Total: ${this.summary.total}`);
    console.log(`  Passed: ${this.summary.passed}`);
    console.log(`  Failed: ${this.summary.failed}`);
    console.log(`  Skipped: ${this.summary.skipped}`);
    console.log();

    if (this.summary.failed > 0) {
      console.log('⚠️  Failure Types:');
      Object.entries(this.summary.failuresByType).forEach(([type, count]) => {
        console.log(`  ${type}: ${count}`);
      });
      console.log();
    }

    this.writeReports();
    console.log('\n✨ Analysis complete!');
    console.log('📖 View report: open test-results/analysis-report.html');
  }
}

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const analyzer = new TestResultAnalyzer();
  analyzer.run().catch(console.error);
}

export default TestResultAnalyzer;
