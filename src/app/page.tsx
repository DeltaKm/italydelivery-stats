'use client';

import { useState } from 'react';
import { OrderAnalyzer } from '@/components/OrderAnalyzer';
import { FileUploader } from '@/components/FileUploader';

export default function Home() {
  const [data, setData] = useState<unknown[]>([]);

  const handleFileLoad = (loadedData: unknown[]) => {
    setData(loadedData);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-1">
            Analisi Ordini e Consegne
          </h1>
          <p className="text-gray-600">
            Carica un file Excel per visualizzare i totali mensili e settimanali
          </p>
        </div>
        
        <FileUploader onFileLoad={handleFileLoad} />
        
        {data.length > 0 && <OrderAnalyzer data={data} />}
      </div>
    </main>
  );
}
