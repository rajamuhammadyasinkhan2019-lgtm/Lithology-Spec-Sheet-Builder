import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Papa from 'papaparse';
import { 
  Beaker, 
  Search, 
  Database, 
  Layers, 
  Activity, 
  Plus,
  Trash2,
  Download,
  ClipboardCheck,
  Copy,
  Upload
} from 'lucide-react';
import { LITHOLOGY_LIBRARY, Lithology } from './data/lithologyLibrary';

// --- Types ---
interface SampleInput {
  mohs: string;
  luster: string;
  cleavage: string;
  crystalSystem: string;
}

interface SavedEntry extends Lithology {
  sampleId: string;
  date: string;
}

export default function App() {
  const [input, setInput] = useState<SampleInput>({
    mohs: '',
    luster: '',
    cleavage: '',
    crystalSystem: '',
  });

  const [savedEntries, setSavedEntries] = useState<SavedEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'builder' | 'archive'>('builder');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Logic ---
  const findBestMatch = (input: SampleInput) => {
    if (!input.mohs && !input.luster && !input.cleavage && !input.crystalSystem) return null;

    // Simple scoring algorithm
    const scores = LITHOLOGY_LIBRARY.map(item => {
      let score = 0;
      
      // Mohs: closer is better
      if (input.mohs) {
        const val = parseFloat(input.mohs);
        if (!isNaN(val)) {
          const diff = Math.abs(item.mohs - val);
          score += Math.max(0, 10 - diff * 2);
        }
      }

      // Luster: fuzzy match
      if (input.luster && item.luster.toLowerCase().includes(input.luster.toLowerCase())) {
        score += 5;
      }

      // Cleavage: fuzzy match
      if (input.cleavage && item.cleavage.toLowerCase().includes(input.cleavage.toLowerCase())) {
        score += 5;
      }

      // Crystal System: exact match
      if (input.crystalSystem && item.crystalSystem.toLowerCase() === input.crystalSystem.toLowerCase()) {
        score += 8;
      }

      return { item, score };
    });

    const bestMatch = scores.sort((a, b) => b.score - a.score)[0];
    return bestMatch.score > 5 ? bestMatch.item : null;
  };

  const matchedLithology = useMemo(() => findBestMatch(input), [input]);

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const importedEntries: SavedEntry[] = [];
        results.data.forEach((row: any) => {
          const sampleInput: SampleInput = {
            mohs: row.mohs || row.Mohs || '',
            luster: row.luster || row.Luster || '',
            cleavage: row.cleavage || row.Cleavage || '',
            crystalSystem: row.crystalSystem || row['Crystal System'] || row.CrystalSystem || '',
          };
          const match = findBestMatch(sampleInput);
          if (match) {
            importedEntries.push({
              ...match,
              sampleId: `IMP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
              date: new Date().toLocaleDateString(),
            });
          }
        });
        
        if (importedEntries.length > 0) {
          setSavedEntries(prev => [...importedEntries, ...prev]);
        }
        
        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
    });
  };

  const copyToClipboard = () => {
    if (savedEntries.length === 0) return;

    const headers = ['Sample ID', 'Date', 'Name', 'Mohs', 'Luster', 'Cleavage', 'Crystal System', 'Formula'];
    const rows = savedEntries.map(e => [
      e.sampleId,
      e.date,
      e.name,
      e.mohs,
      e.luster,
      e.cleavage,
      e.crystalSystem,
      e.chemicalFormula
    ]);

    // Using tabs for easy spreadsheet pasting
    const content = [headers, ...rows].map(row => row.join('\t')).join('\n');

    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  const handleSave = () => {
    if (matchedLithology) {
      const newEntry: SavedEntry = {
        ...matchedLithology,
        sampleId: `LAB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        date: new Date().toLocaleDateString(),
      };
      setSavedEntries([newEntry, ...savedEntries]);
      setInput({ mohs: '', luster: '', cleavage: '', crystalSystem: '' });
      setActiveTab('archive');
    }
  };

  const deleteEntry = (id: string) => {
    setSavedEntries(savedEntries.filter(e => e.sampleId !== id));
  };

  return (
    <div className="min-h-screen bg-blue-50 text-blue-950 font-sans selection:bg-blue-950 selection:text-blue-50">
      {/* Sidebar / Nav */}
      <nav className="fixed left-0 top-0 h-full w-16 md:w-64 border-r border-blue-950 bg-blue-50 z-50 flex flex-col">
        <div className="p-6 border-b border-blue-950 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-950 flex items-center justify-center rounded-sm">
            <Layers className="text-blue-50 w-5 h-5" />
          </div>
          <span className="hidden md:block font-bold tracking-tighter text-lg uppercase">LithoSpec</span>
        </div>

        <div className="flex-1 py-10 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('builder')}
            className={`flex items-center gap-4 px-6 py-3 transition-colors ${activeTab === 'builder' ? 'bg-blue-950 text-blue-50' : 'hover:bg-blue-950/5'}`}
          >
            <Plus className="w-5 h-5" />
            <span className="hidden md:block font-medium uppercase text-xs tracking-widest">Spec Builder</span>
          </button>
          <button 
            onClick={() => setActiveTab('archive')}
            className={`flex items-center gap-4 px-6 py-3 transition-colors ${activeTab === 'archive' ? 'bg-blue-950 text-blue-50' : 'hover:bg-blue-950/5'}`}
          >
            <Database className="w-5 h-5" />
            <span className="hidden md:block font-medium uppercase text-xs tracking-widest">Lab Archive</span>
          </button>
        </div>

        <div className="p-6 border-t border-blue-950 text-[10px] font-mono opacity-50 hidden md:block">
          SYSTEM_V_1.0.4<br />
          LOCAL_DATA_ONLY
        </div>
      </nav>

      {/* Main Content */}
      <main className="ml-16 md:ml-64 p-4 md:p-12">
        <AnimatePresence mode="wait">
          {activeTab === 'builder' ? (
            <motion.div 
              key="builder"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-5xl mx-auto"
            >
              <header className="mb-12">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase mb-4 italic font-serif">Spec-Sheet Builder</h1>
                <p className="text-sm font-mono opacity-60 uppercase tracking-widest">Input raw mineralogical data to generate standardized catalog entries</p>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Input Panel */}
                <div className="lg:col-span-5 space-y-8">
                  <div className="bg-white/50 border border-blue-950 p-8 rounded-sm shadow-[4px_4px_0px_theme(colors.blue.950)]">
                    <div className="flex items-center gap-2 mb-6 opacity-40">
                      <Beaker className="w-4 h-4" />
                      <span className="text-[10px] font-mono uppercase tracking-widest">Raw Data Input</span>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-[11px] font-serif italic uppercase mb-2 opacity-60">Mohs Hardness (1-10)</label>
                        <input 
                          type="number" 
                          step="0.5"
                          value={input.mohs}
                          onChange={(e) => setInput({...input, mohs: e.target.value})}
                          placeholder="e.g. 7.0"
                          className="w-full bg-transparent border-b border-blue-950 py-2 focus:outline-none font-mono text-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-serif italic uppercase mb-2 opacity-60">Luster</label>
                        <input 
                          type="text" 
                          value={input.luster}
                          onChange={(e) => setInput({...input, luster: e.target.value})}
                          placeholder="e.g. Vitreous"
                          className="w-full bg-transparent border-b border-blue-950 py-2 focus:outline-none font-mono text-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-serif italic uppercase mb-2 opacity-60">Cleavage</label>
                        <input 
                          type="text" 
                          value={input.cleavage}
                          onChange={(e) => setInput({...input, cleavage: e.target.value})}
                          placeholder="e.g. Perfect"
                          className="w-full bg-transparent border-b border-blue-950 py-2 focus:outline-none font-mono text-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-serif italic uppercase mb-2 opacity-60">Crystal System</label>
                        <select 
                          value={input.crystalSystem}
                          onChange={(e) => setInput({...input, crystalSystem: e.target.value})}
                          className="w-full bg-transparent border-b border-blue-950 py-2 focus:outline-none font-mono text-xl appearance-none"
                        >
                          <option value="">Select System</option>
                          <option value="Isometric">Isometric</option>
                          <option value="Hexagonal">Hexagonal</option>
                          <option value="Trigonal">Trigonal</option>
                          <option value="Orthorhombic">Orthorhombic</option>
                          <option value="Monoclinic">Monoclinic</option>
                          <option value="Triclinic">Triclinic</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => setInput({ mohs: '', luster: '', cleavage: '', crystalSystem: '' })}
                      className="flex-1 border border-blue-950 py-4 text-xs font-bold uppercase tracking-widest hover:bg-blue-950 hover:text-blue-50 transition-colors"
                    >
                      Clear Data
                    </button>
                    <button 
                      disabled={!matchedLithology}
                      onClick={handleSave}
                      className="flex-1 bg-blue-950 text-blue-50 py-4 text-xs font-bold uppercase tracking-widest hover:bg-blue-950/90 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                    >
                      Save to Archive
                    </button>
                  </div>
                </div>

                {/* Preview Panel */}
                <div className="lg:col-span-7">
                  <div className="relative min-h-[500px] border border-blue-950 bg-white p-1 rounded-sm overflow-hidden shadow-[8px_8px_0px_theme(colors.blue.950)]">
                    <AnimatePresence mode="wait">
                      {matchedLithology ? (
                        <motion.div 
                          key={matchedLithology.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="h-full flex flex-col"
                        >
                          {/* Top Trumps Style Header */}
                          <div className="bg-blue-950 text-blue-50 p-6 flex justify-between items-end">
                            <div>
                              <span className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-50">Lithology Match</span>
                              <h2 className="text-4xl font-bold tracking-tighter uppercase">{matchedLithology.name}</h2>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-50">Hardness</span>
                              <div className="text-4xl font-bold font-mono">{matchedLithology.mohs}</div>
                            </div>
                          </div>

                          <div className="p-8 flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                              <div className="aspect-[4/3] border border-blue-950 overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
                                <img 
                                  src={matchedLithology.image} 
                                  alt={matchedLithology.name} 
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div className="space-y-4">
                                <div className="border-b border-blue-950 pb-2">
                                  <span className="text-[9px] font-mono uppercase opacity-40">Chemical Formula</span>
                                  <p className="font-mono text-sm">{matchedLithology.chemicalFormula}</p>
                                </div>
                                <div className="border-b border-blue-950 pb-2">
                                  <span className="text-[9px] font-mono uppercase opacity-40">Crystal System</span>
                                  <p className="font-mono text-sm">{matchedLithology.crystalSystem}</p>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 border border-blue-950 bg-blue-950/5">
                                  <span className="text-[9px] font-mono uppercase opacity-40 block mb-1">Luster</span>
                                  <span className="text-xs font-bold uppercase">{matchedLithology.luster}</span>
                                </div>
                                <div className="p-3 border border-blue-950 bg-blue-950/5">
                                  <span className="text-[9px] font-mono uppercase opacity-40 block mb-1">Cleavage</span>
                                  <span className="text-xs font-bold uppercase">{matchedLithology.cleavage}</span>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <span className="text-[9px] font-mono uppercase opacity-40 block mb-1">Description</span>
                                  <p className="text-xs leading-relaxed font-serif italic">{matchedLithology.description}</p>
                                </div>
                                <div>
                                  <span className="text-[9px] font-mono uppercase opacity-40 block mb-1">Streak</span>
                                  <p className="text-xs font-bold uppercase">{matchedLithology.streak}</p>
                                </div>
                                <div>
                                  <span className="text-[9px] font-mono uppercase opacity-40 block mb-1">Common Colors</span>
                                  <p className="text-xs font-bold uppercase">{matchedLithology.color}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="p-6 border-t border-blue-950 flex justify-between items-center bg-blue-950/5">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                              <span className="text-[10px] font-mono uppercase tracking-widest">Logic Match Verified</span>
                            </div>
                            <span className="text-[10px] font-mono opacity-40">REF_ID: {matchedLithology.id.toUpperCase()}</span>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-20">
                          <Search className="w-16 h-16 mb-6" />
                          <h3 className="text-2xl font-bold uppercase tracking-tighter">Awaiting Input</h3>
                          <p className="text-xs font-mono max-w-[200px] mt-2">Enter physical properties to generate a spec-sheet match</p>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="archive"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-6xl mx-auto"
            >
              <header className="mb-12 flex justify-between items-end">
                <div>
                  <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase mb-4 italic font-serif">Lab Archive</h1>
                  <div className="flex flex-wrap items-center gap-4">
                    <p className="text-sm font-mono opacity-60 uppercase tracking-widest">Archived standardized catalog entries</p>
                    
                    <div className="flex items-center gap-2">
                      <input 
                        type="file" 
                        accept=".csv" 
                        className="hidden" 
                        ref={fileInputRef}
                        onChange={handleImportCSV}
                      />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-3 py-1 border border-blue-950 text-[10px] font-mono uppercase tracking-widest hover:bg-blue-950 hover:text-blue-50 transition-all group"
                      >
                        <Upload className="w-3 h-3 group-hover:scale-110 transition-transform" />
                        <span>Import CSV</span>
                      </button>

                      <button 
                        onClick={copyToClipboard}
                        disabled={savedEntries.length === 0}
                        className="flex items-center gap-2 px-3 py-1 border border-blue-950 text-[10px] font-mono uppercase tracking-widest hover:bg-blue-950 hover:text-blue-50 transition-all disabled:opacity-20 disabled:cursor-not-allowed group"
                      >
                        {copied ? (
                          <>
                            <ClipboardCheck className="w-3 h-3 text-green-500" />
                            <span>Copied to Clipboard</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 group-hover:scale-110 transition-transform" />
                            <span>Copy for Spreadsheet</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-right hidden md:block">
                  <div className="text-4xl font-bold font-mono">{savedEntries.length}</div>
                  <span className="text-[10px] font-mono uppercase opacity-40">Total Samples</span>
                </div>
              </header>

              <div className="bg-white border border-blue-950 rounded-sm shadow-[8px_8px_0px_theme(colors.blue.950)] overflow-hidden">
                <div className="grid grid-cols-6 p-4 border-b border-blue-950 bg-blue-950 text-blue-50 text-[10px] font-mono uppercase tracking-widest">
                  <div className="col-span-1">ID</div>
                  <div className="col-span-1">Date</div>
                  <div className="col-span-1">Lithology</div>
                  <div className="col-span-1">Hardness</div>
                  <div className="col-span-1">System</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>

                {savedEntries.length === 0 ? (
                  <div className="p-20 text-center opacity-30">
                    <Database className="w-12 h-12 mx-auto mb-4" />
                    <p className="text-xs font-mono uppercase tracking-widest">No entries found in local storage</p>
                  </div>
                ) : (
                  <div className="divide-y divide-blue-950">
                    {savedEntries.map((entry) => (
                      <div key={entry.sampleId} className="grid grid-cols-6 p-4 items-center hover:bg-blue-950/5 transition-colors group">
                        <div className="col-span-1 font-mono text-xs font-bold">{entry.sampleId}</div>
                        <div className="col-span-1 font-mono text-[10px] opacity-60">{entry.date}</div>
                        <div className="col-span-1 font-serif italic font-bold">{entry.name}</div>
                        <div className="col-span-1 font-mono text-xs">{entry.mohs}</div>
                        <div className="col-span-1 text-[10px] uppercase tracking-tighter">{entry.crystalSystem}</div>
                        <div className="col-span-1 flex justify-end gap-3">
                          <button className="p-2 hover:bg-blue-950 hover:text-blue-50 transition-colors rounded-sm">
                            <Download className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteEntry(entry.sampleId)}
                            className="p-2 hover:bg-red-500 hover:text-white transition-colors rounded-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Info Overlay */}
      <div className="fixed bottom-6 right-6 flex items-center gap-4 pointer-events-none">
        <div className="bg-blue-950 text-blue-50 px-4 py-2 rounded-sm text-[10px] font-mono uppercase tracking-widest flex items-center gap-2 shadow-lg">
          <Activity className="w-3 h-3 text-green-500" />
          Terminal Active
        </div>
      </div>
    </div>
  );
}
