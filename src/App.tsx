/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnalyzeListing } from './pages/AnalyzeListing';
import { AnalyzeURL } from './pages/AnalyzeURL';
import { HiddenGems } from './pages/HiddenGems';
import { ModelPerformance } from './pages/ModelPerformance';
import { ErrorAnalysis } from './pages/ErrorAnalysis';
import { ExploreDVF } from './pages/ExploreDVF';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AnalyzeListing />} />
        <Route path="/url" element={<AnalyzeURL />} />
        <Route path="/gems" element={<HiddenGems />} />
        <Route path="/performance" element={<ModelPerformance />} />
        <Route path="/errors" element={<ErrorAnalysis />} />
        <Route path="/explore" element={<ExploreDVF />} />
      </Routes>
    </Router>
  );
}
