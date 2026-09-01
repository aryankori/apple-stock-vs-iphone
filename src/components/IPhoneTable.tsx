import React, { useState, useMemo } from 'react';
import { IPhoneCalculation } from '../types';
import { formatCurrency, formatPercentage } from '../utils/calculator';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Download, Filter } from 'lucide-react';

interface IPhoneTableProps {
  models: IPhoneCalculation[];
  onSelectModel: (model: IPhoneCalculation) => void;
  selectedModelId: string;
}

type SortField = 'model' | 'releaseDate' | 'modelPrice' | 'historicalStockPrice' | 'sharesPurchased' | 'investedValue' | 'profit' | 'roi';

export const IPhoneTable: React.FC<IPhoneTableProps> = ({
  models,
  onSelectModel,
  selectedModelId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGeneration, setSelectedGeneration] = useState('All');
  const [sortField, setSortField] = useState<SortField>('releaseDate');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Extract unique generations
  const generations = useMemo(() => {
    const unique = Array.from(new Set(models.map(m => m.generation)));
    return ['All', ...unique];
  }, [models]);

  // Filter and sort models
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
    <div className="apple-card rounded-3xl p-6 sm:p-7 border border-white/10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Complete iPhone Analysis Ledger</h2>
          <p className="text-xs text-slate-400 mt-1">
            Displaying all {filteredAndSortedModels.length} models with exact split-adjusted values.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search model, year, price..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#16161d] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Export CSV */}
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-slate-200 hover:text-white transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Generation Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto py-4 border-b border-white/5 no-scrollbar">
        <span className="text-xs text-slate-500 flex items-center gap-1 pl-1 pr-2 flex-shrink-0">
          <Filter className="w-3 h-3" /> Filter:
        </span>
        {generations.map(gen => (
          <button
            key={gen}
            onClick={() => setSelectedGeneration(gen)}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              selectedGeneration === gen
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                : 'bg-white/[0.04] text-slate-400 hover:text-slate-200 hover:bg-white/[0.08]'
            }`}
          >
            {gen}
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4 cursor-pointer hover:text-white transition" onClick={() => handleSort('model')}>
                <div className="flex items-center gap-1.5">
                  <span>Model</span>
                  {sortField === 'model' ? (sortAsc ? <ArrowUp className="w-3 h-3 text-blue-400" /> : <ArrowDown className="w-3 h-3 text-blue-400" />) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                </div>
              </th>
              <th className="py-3 px-4 cursor-pointer hover:text-white transition" onClick={() => handleSort('releaseDate')}>
                <div className="flex items-center gap-1.5">
                  <span>Release Date</span>
                  {sortField === 'releaseDate' ? (sortAsc ? <ArrowUp className="w-3 h-3 text-blue-400" /> : <ArrowDown className="w-3 h-3 text-blue-400" />) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                </div>
              </th>
              <th className="py-3 px-4 text-right cursor-pointer hover:text-white transition" onClick={() => handleSort('modelPrice')}>
                <div className="flex items-center justify-end gap-1.5">
                  <span>MSRP</span>
                  {sortField === 'modelPrice' ? (sortAsc ? <ArrowUp className="w-3 h-3 text-blue-400" /> : <ArrowDown className="w-3 h-3 text-blue-400" />) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                </div>
              </th>
              <th className="py-3 px-4 text-right cursor-pointer hover:text-white transition" onClick={() => handleSort('historicalStockPrice')}>
                <div className="flex items-center justify-end gap-1.5">
                  <span>AAPL at Launch</span>
                  {sortField === 'historicalStockPrice' ? (sortAsc ? <ArrowUp className="w-3 h-3 text-blue-400" /> : <ArrowDown className="w-3 h-3 text-blue-400" />) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                </div>
              </th>
              <th className="py-3 px-4 text-right cursor-pointer hover:text-white transition" onClick={() => handleSort('sharesPurchased')}>
                <div className="flex items-center justify-end gap-1.5">
                  <span>Shares</span>
                  {sortField === 'sharesPurchased' ? (sortAsc ? <ArrowUp className="w-3 h-3 text-blue-400" /> : <ArrowDown className="w-3 h-3 text-blue-400" />) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                </div>
              </th>
              <th className="py-3 px-4 text-right cursor-pointer hover:text-white transition" onClick={() => handleSort('investedValue')}>
                <div className="flex items-center justify-end gap-1.5">
                  <span>Value Today</span>
                  {sortField === 'investedValue' ? (sortAsc ? <ArrowUp className="w-3 h-3 text-blue-400" /> : <ArrowDown className="w-3 h-3 text-blue-400" />) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                </div>
              </th>
              <th className="py-3 px-4 text-right cursor-pointer hover:text-white transition" onClick={() => handleSort('profit')}>
                <div className="flex items-center justify-end gap-1.5">
                  <span>Net Profit</span>
                  {sortField === 'profit' ? (sortAsc ? <ArrowUp className="w-3 h-3 text-blue-400" /> : <ArrowDown className="w-3 h-3 text-blue-400" />) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                </div>
              </th>
              <th className="py-3 px-4 text-right cursor-pointer hover:text-white transition" onClick={() => handleSort('roi')}>
                <div className="flex items-center justify-end gap-1.5">
                  <span>ROI (%)</span>
                  {sortField === 'roi' ? (sortAsc ? <ArrowUp className="w-3 h-3 text-blue-400" /> : <ArrowDown className="w-3 h-3 text-blue-400" />) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                </div>
              </th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-xs">
            {filteredAndSortedModels.map((item) => {
              const isSelected = item.id === selectedModelId;
              return (
                <tr
                  key={item.id}
                  className={`hover:bg-white/[0.04] transition group ${
                    isSelected ? 'bg-blue-600/10' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 font-semibold text-white flex items-center gap-2">
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                    <span>{item.model}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono">
                    {item.releaseDate}
                  </td>
                  <td className="py-3.5 px-4 text-right font-medium text-slate-300">
                    {formatCurrency(item.modelPrice)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-medium text-slate-400">
                    ${item.historicalStockPrice.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-300">
                    {item.sharesPurchased.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-blue-400">
                    {formatCurrency(item.investedValue)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-semibold text-emerald-400">
                    +{formatCurrency(item.profit)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-emerald-400">
                    +{formatPercentage(item.roi)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => onSelectModel(item)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white'
                      }`}
                    >
                      {isSelected ? 'Active' : 'Simulate'}
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
