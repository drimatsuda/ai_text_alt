import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { Spinner } from './components/Spinner';
import { generateAltText } from './services/geminiService';
import { CameraIcon } from './components/icons';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [charLimit, setCharLimit] = useState<number>(125);
  const [altText, setAltText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    setAltText('');
    setError(null);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageUrl(null);
    }
  };

  const handleGenerateClick = useCallback(async () => {
    if (!imageFile) {
      setError('Por favor, selecione uma imagem primeiro.');
      return;
    }
    setIsLoading(true);
    setAltText('');
    setError(null);

    try {
      const generatedText = await generateAltText(imageFile, charLimit);
      setAltText(generatedText);
    } catch (err: unknown) {
      if (err instanceof Error) {
          setError(`Ocorreu um erro: ${err.message}. Tente novamente.`);
      } else {
          setError('Ocorreu um erro desconhecido. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, charLimit]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="inline-block bg-primary-light p-3 rounded-full mb-4">
              <CameraIcon className="w-8 h-8 text-primary"/>
          </div>
          <h1 className="text-4xl font-bold text-gray-800">Gerador de Texto Alternativo</h1>
          <p className="text-lg text-gray-600 mt-2">
            Crie descrições acessíveis para suas imagens.
          </p>
        </header>

        <main className="bg-white rounded-2xl shadow-xl p-6 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="flex flex-col space-y-6">
            <div>
              <label htmlFor="char-limit" className="block text-sm font-medium text-gray-700 mb-2">
                Limite de Caracteres
              </label>
              <input
                id="char-limit"
                type="number"
                value={charLimit}
                onChange={(e) => setCharLimit(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
                min="50"
                max="500"
              />
            </div>
            
            <ImageUploader
              imageUrl={imageUrl}
              onImageChange={handleImageChange}
            />

            <button
              onClick={handleGenerateClick}
              disabled={!imageFile || isLoading}
              className="w-full flex items-center justify-center bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
            >
              {isLoading ? (
                <>
                  <Spinner />
                  Gerando...
                </>
              ) : (
                'Gerar Texto Alternativo'
              )}
            </button>
          </div>

          <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Resultado</h2>
            <div className="flex-grow">
                {error && <div className="text-red-600 bg-red-100 p-4 rounded-lg">{error}</div>}
                <ResultDisplay altText={altText} isLoading={isLoading} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;