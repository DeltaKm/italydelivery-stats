'use client';

import { ChangeEvent, useRef } from 'react';
import * as XLSX from 'xlsx';

interface FileUploaderProps {
  onFileLoad: (data: unknown[]) => void;
}

export function FileUploader({ onFileLoad }: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        onFileLoad(jsonData);
      } catch (error) {
        console.error('Errore nel caricamento del file:', error);
        alert('Errore nel caricamento del file. Assicurati che sia un file Excel valido.');
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
      <div className="flex flex-col items-center justify-center">
        <div className="mb-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-10 h-10 text-green-600" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM8 18v-1h8v1H8zm0-4v-1h8v1H8zm0-4v-1h5v1H8z"/>
            </svg>
          </div>
        </div>
        <label htmlFor="file-upload" className="cursor-pointer">
          <span className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-8 rounded-lg transition duration-200 inline-block text-sm">
            Carica File Excel
          </span>
          <input
            id="file-upload"
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        <p className="mt-3 text-sm text-gray-500">
          File caricato
        </p>
      </div>
    </div>
  );
}
