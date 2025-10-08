
import React, { useState, useEffect } from 'react';
import { CopyIcon, CheckIcon } from './icons';

interface ResultDisplayProps {
  altText: string;
  isLoading: boolean;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ altText, isLoading }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isLoading && altText) {
      setCopied(false);
    }
  }, [isLoading, altText]);
  
  const handleCopy = () => {
    if (altText) {
      navigator.clipboard.writeText(altText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const hasContent = altText.length > 0;

  return (
    <div className={`relative flex flex-col justify-between w-full h-full min-h-[200px] bg-gray-100 rounded-lg p-4 transition-all duration-300 ${!hasContent && !isLoading ? 'items-center justify-center' : ''}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg backdrop-blur-sm z-10">
          <p className="text-gray-600 font-medium">Analisando a imagem...</p>
        </div>
      )}
      {!hasContent && !isLoading && (
        <div className="text-center text-gray-400">
            <p>Seu texto alternativo aparecerá aqui.</p>
        </div>
      )}
      {hasContent && (
        <>
            <textarea
              readOnly
              value={altText}
              className="w-full flex-grow bg-transparent text-gray-800 resize-none focus:outline-none"
              rows={6}
            />
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                <span className="text-sm text-gray-500">{altText.length} caracteres</span>
                <button
                onClick={handleCopy}
                className="flex items-center space-x-2 text-sm text-primary font-medium hover:text-primary-dark transition-colors"
                >
                {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                </button>
            </div>
        </>
      )}
    </div>
  );
};
