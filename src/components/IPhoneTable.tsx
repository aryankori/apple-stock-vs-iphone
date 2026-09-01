import React, { useState, useMemo } from 'react';
import { IPhoneCalculation } from '../types';
import { formatCurrency, formatPercentage } from '../utils/calculator';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Download } from 'lucide-react';

interface IPhoneTableProps {
  models: IPhoneCalculation[];
  onSelectModel: (model: IPhoneCalculation) => void;
  selectedModelId: string;
  theme?: 'green' | 'amber';
}

type SortField = 'model' | 'releaseDate' | 'modelPrice' | 'historicalStockPrice' | 'sharesPurchased' | 'investedValue' | 'profit' | 'roi';

export const IPhoneTable: React.FC<IPhoneTableProps> = ({
  models,
  onSelectModel,
  selectedModelId,
  theme = 'green',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGeneration, setSelectedGeneration] = useState('All');
  const [sortField, setSortField] = useState<SortField>('releaseDate');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const isGreen = theme === 'green';
  const borderColor = isGreen ? 'border-[#1f521f]' : 'border-[#593c00]';
  const primaryText = isGreen ? 'text-[#33ff00] terminal-glow' : 'text-[#ffb000] amber-glow';
  const headerBg = isGreen ? 'bg-[#0f1a0f]' : 'bg-[#1a1400]';

  const generations = useMemo(() => {
    const unique = Array.from(new Set(models.map(m => m.generation)));
    return ['All', ...unique];
  }, [models]);

  const filteredAndSortedModels = useMemo(() => {
    return models
      .filter(item => {
        const matchesSearch = item.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              item.releaseDate.includes(searchQuery) ||
                              item.modelPrice.toString().includes(searchQuery);
        const matchesGen = selectedGeneration === 'All' || item.generation === selectedGeneration;
        return matchesSearch && matchesGen;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }

        const numA = Number(valA);
        const numB = Number(valB);
        return sortAsc ? numA - numB : numB - numA;
      });
  }, [models, searchQuery, selectedGeneration, sortField, sortAsc]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(field === 'model' || field === 'releaseDate');
    }
  };

  const handleExportCsv = () => {
    const headers = [
      'Model',
      'Release Date',
      'Model Price (USD)',
      'Historical Stock Price (USD)',
      'Current Stock Price (USD)',
      'Shares Purchased',
      'Invested Value (USD)',
      'Profit (USD)',
      'ROI (%)'
    ];

    const rows = filteredAndSortedModels.map(m => [
      `"${m.model}"`,
      m.releaseDate,
      m.modelPrice.toFixed(2),
      m.historicalStockPrice.toFixed(2),
      m.currentStockPrice.toFixed(2),
      m.sharesPurchased.toFixed(4),
      m.investedValue.toFixed(2),
      m.profit.toFixed(2),
      (m.roi * 100).toFixed(2) + '%'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `apple_stock_vs_iphone_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`terminal-box ${isGreen ? '' : 'terminal-box-amber'} border ${borderColor}`}>
      {/* Pane Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-3 px-3 py-2 ${headerBg} border-b ${borderColor} text-xs font-mono`}>
        <div className="flex items-center gap-2">
          <span className={`font-bold uppercase tracking-wider ${primaryText}`}>
            +-- DATABASE // CANONICAL LEDGER [RECORDS: {filteredAndSortedModels.length}/49] --+
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Grep Search Bar */}
          <div className="flex items-center border border-[#1f521f] bg-[#050505] px-2 py-1">
            <Search className="w-3 h-3 text-slate-500 mr-1.5" />
            <span className="text-slate-500 text-[11px] mr-1">grep:</span>
            <input
              type="text"
              placeholder="model/year..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-white font-mono text-xs focus:outline-none w-28 sm:w-36 placeholder:text-slate-700"
            />
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCsv}
            className="terminal-btn flex items-center gap-1 text-[11px]"
          >
            <Download className="w-3 h-3" />
            <span>[ EXPORT.CSV ]</span>
          </button>
        </div>
      </div>

      {/* Generation Filter Chips */}
      <div className="px-3 py-2 bg-[#090909] border-b border-[#1f521f]/50 flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
        <span className="text-slate-500 flex-shrink-0">FLAGS:</span>
        {generations.map(gen => (
          <button
            key={gen}
            onClick={() => setSelectedGeneration(gen)}
            className={`px-2 py-0.5 whitespace-nowrap transition uppercase ${
              selectedGeneration === gen
                ? 'bg-[#33ff00] text-black font-bold'
                : 'text-slate-400 hover:text-white border border-[#1f521f]'
            }`}
          >
            --{gen.toLowerCase().replace(/[^a-z0-9]/g, '-')}
          </button>
        ))}
      </div>

      {/* Monospace Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="bg-[#0f140f] border-b border-[#1f521f] text-[11px] text-slate-400 uppercase">
              <th className="py-2.5 px-3 cursor-pointer hover:text-white transition" onClick={() => handleSort('model')}>
                <div className="flex items-center gap-1">
                  <span>MODEL</span>
                  {sortField === 'model' ? (sortAsc ? <ArrowUp className="w-3 h-3 text-[#33ff00]" /> : <ArrowDown className="w-3 h-3 text-[#33ff00]" />) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                </div>
              </th>
              <th className="py-2.5 px-3 cursor-pointer hover:text-white transition" onClick={() => handleSort('releaseDate')}>
                <div className="flex items-center gap-1">
                  <span>LAUNCH_DATE</span>
                  {sortField === 'releaseDate' ? (sortAsc ? <ArrowUp className="w-3 h-3 text-[#33ff00]" /> : <ArrowDown className="w-3 h-3 text-[#33ff00]" />) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                </div>
              </th>
              <th className="py-2.5 px-3 text-right cursor-pointer hover:text-white transition" onClick={() => handleSort('modelPrice')}>
                <div className="flex items-center justify-end gap-1">
                  <span>MSRP</span>
                  {sortField === 'modelPrice' ? (sortAsc ? <ArrowUp className="w-3 h-3 text-[#33ff00]" /> : <ArrowDown className="w-3 h-3 text-[#33ff00]" />) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                </div>
              </th>
              <th className="py-2.5 px-3 text-right cursor-pointer hover:text-white transition" onClick={() => handleSort('historicalStockPrice')}>
                <div className="flex items-center justify-end gap-1">
                  <span>AAPL_LAUNCH</span>
                  {sortField === 'historicalStockPrice' ? (sortAsc ? <ArrowUp className="w-3 h-3 text-[#33ff00]" /> : <ArrowDown className="w-3 h-3 text-[#33ff00]" />) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                </div>
              </th>
              <th className="py-2.5 px-3 text-right cursor-pointer hover:text-white transition" onClick={() => handleSort('sharesPurchased')}>
                <div className="flex items-center justify-end gap-1">
                  <span>SHARES</span>
                  {sortField === 'sharesPurchased' ? (sortAsc ? <ArrowUp className="w-3 h-3 text-[#33ff00]" /> : <ArrowDown className="w-3 h-3 text-[#33ff00]" />) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                </div>
              </th>
              <th className="py-2.5 px-3 text-right cursor-pointer hover:text-white transition" onClick={() => handleSort('investedValue')}>
                <div className="flex items-center justify-end gap-1">
                  <span>EQUITY_VAL</span>
                  {sortField === 'investedValue' ? (sortAsc ? <ArrowUp className="w-3 h-3 text-[#33ff00]" /> : <ArrowDown className="w-3 h-3 text-[#33ff00]" />) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                </div>
              </th>
              <th className="py-2.5 px-3 text-right cursor-pointer hover:text-white transition" onClick={() => handleSort('profit')}>
                <div className="flex items-center justify-end gap-1">
                  <span>GAIN</span>
                  {sortField === 'profit' ? (sortAsc ? <ArrowUp className="w-3 h-3 text-[#33ff00]" /> : <ArrowDown className="w-3 h-3 text-[#33ff00]" />) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                </div>
              </th>
              <th className="py-2.5 px-3 text-right cursor-pointer hover:text-white transition" onClick={() => handleSort('roi')}>
                <div className="flex items-center justify-end gap-1">
                  <span>ROI (%)</span>
                  {sortField === 'roi' ? (sortAsc ? <ArrowUp className="w-3 h-3 text-[#33ff00]" /> : <ArrowDown className="w-3 h-3 text-[#33ff00]" />) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                </div>
              </th>
              <th className="py-2.5 px-3 text-center">CMD</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1f521f]/40 text-xs font-mono">
            {filteredAndSortedModels.map((item) => {
              const isSelected = item.id === selectedModelId;
              return (
                <tr
                  key={item.id}
                  className={`hover:bg-[#152a15]/60 transition ${
                    isSelected ? 'bg-[#153515] text-[#33ff00]' : ''
                  }`}
                >
                  <td className="py-2 px-3 font-bold text-white flex items-center gap-1.5">
                    <span className="text-slate-600">[{item.id.padStart(2, '0')}]</span>
                    <span>{item.model}</span>
                  </td>
                  <td className="py-2 px-3 text-slate-400">
                    {item.releaseDate}
                  </td>
                  <td className="py-2 px-3 text-right text-slate-300">
                    {formatCurrency(item.modelPrice)}
                  </td>
                  <td className="py-2 px-3 text-right text-slate-400">
                    ${item.historicalStockPrice.toFixed(2)}
                  </td>
                  <td className="py-2 px-3 text-right text-slate-300">
                    {item.sharesPurchased.toFixed(2)}
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-[#33ff00]">
                    {formatCurrency(item.investedValue)}
                  </td>
                  <td className="py-2 px-3 text-right text-[#33ff00]">
                    +{formatCurrency(item.profit)}
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-[#33ff00]">
                    +{formatPercentage(item.roi)}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <button
                      onClick={() => onSelectModel(item)}
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase transition ${
                        isSelected
                          ? 'bg-[#33ff00] text-black'
                          : 'border border-[#1f521f] text-slate-300 hover:bg-[#33ff00] hover:text-black'
                      }`}
                    >
                      {isSelected ? '[ACTIVE]' : '[LOAD]'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
