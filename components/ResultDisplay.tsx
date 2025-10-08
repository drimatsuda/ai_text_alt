
import React, { useState, useEffect } from 'react';
import { CopyIcon, CheckIcon, WarningIcon } from './icons';

interface ResultDisplayProps {
  altText: string;
  keywords: string[];
  isLoading: boolean;
  charLimit: number;
}

const ResultSkeleton: React.FC = () => (
    <div className="w-full h-full animate-pulse space-y-6">
        <div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-20 bg-gray-200 rounded-md"></div>
        </div>
        <div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
            <div className="flex flex-wrap gap-2">
                <div className="h-7 bg-gray-200 rounded-full w-20"></div>
                <div className="h-7 bg-gray-200 rounded-full w-28"></div>
                <div className="h-7 bg-gray-200 rounded-full w-24"></div>
            </div>
        </div>
        <div className="h-12 bg-gray-200 rounded-md"></div>
    </div>
);


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ altText, keywords, isLoading, charLimit }) => {
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
  const isWithinLimit = altText.length <= charLimit;

  return (
    <div className={`relative flex flex-col w-full h-full min-h-[290px] bg-gray-50 rounded-lg p-5 transition-all duration-300`}>
      {isLoading && <ResultSkeleton />}

      {!isLoading && !hasContent && (
        <div className="m-auto text-center text-gray-400">
            <p>Sua análise de imagem aparecerá aqui.</p>
        </div>
      )}

      {!isLoading && hasContent && (
        <div className="flex flex-col h-full space-y-4 animate-fade-in">
            <div>
              <label className="text-sm font-semibold text-gray-600" id="alt-text-label">Texto Alternativo Gerado</label>
              <div className="relative mt-1 group">
                <textarea
                  id="alt-text-area"
                  aria-labelledby="alt-text-label"
                  readOnly
                  value={altText}
                  className="w-full p-3 pr-12 bg-white border border-gray-200 rounded-md text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-primary-light"
                  rows={4}
                />
                <button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 flex items-center space-x-2 text-sm text-gray-500 font-medium hover:text-primary transition-colors bg-gray-100 hover:bg-primary-light p-2 rounded-md opacity-50 group-hover:opacity-100"
                    aria-label={copied ? 'Copiado para a área de transferência' : 'Copiar texto alternativo'}
                >
                    {copied ? <CheckIcon className="w-5 h-5 text-green-500" /> : <CopyIcon className="w-5 h-5" />}
                </button>
              </div>
              <p className={`text-xs text-right mt-1 ${isWithinLimit ? 'text-gray-400' : 'text-red-500 font-medium'}`}>{altText.length} / {charLimit} caracteres</p>
            </div>
            
            {keywords && keywords.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">Palavras-chave</h3>
                    <div className="flex flex-wrap gap-2">
                        {keywords.map((keyword, index) => (
                            <span key={index} className="px-3 py-1 bg-primary-light text-primary-dark text-sm font-medium rounded-full">
                                {keyword}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="!mt-auto pt-4"> 
              {isWithinLimit ? (
                <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded-r-md">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <CheckIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-green-800">
                                O comprimento do texto é ideal para a maioria dos leitores de tela.
                            </p>
                        </div>
                    </div>
                </div>
              ) : (
                <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-md">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <WarningIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-800">
                                O texto excedeu o limite. Considere aumentar o limite ou regenerar para concisão.
                            </p>
                        </div>
                    </div>
                </div>
              )}
            </div>
        </div>
      )}
    </div>
  );
};

// Simple fade-in animation
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style);
