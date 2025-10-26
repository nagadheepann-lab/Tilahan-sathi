import React, { useState, useEffect, useMemo } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { getDealerInfo } from '../services/geminiService';
import Card from './common/Card';
import { Dealer } from '../types';
import StarRating from './common/StarRating';
import MapPinIcon from './icons/MapPinIcon';

const DealerLocatorPage: React.FC<{ location: string }> = ({ location }) => {
    const { t, language } = useLocalization();
    const [dealers, setDealers] = useState<Dealer[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLocating, setIsLocating] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [sortByRating, setSortByRating] = useState(false);
    const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
    const [selectedDealerIndex, setSelectedDealerIndex] = useState<number | null>(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCoords({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                    setIsLocating(false);
                },
                (geoError) => {
                    console.error("Geolocation error:", geoError);
                    setError(t('locationError'));
                    setIsLocating(false);
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
            setIsLocating(false);
        }
    }, [t]);

    useEffect(() => {
        if (!coords) return;

        const fetchDealers = async () => {
            setIsLoading(true);
            setError('');
            try {
                const result = await getDealerInfo(coords.lat, coords.lon, language);
                if (Array.isArray(result)) {
                    setDealers(result);
                } else if (typeof result === 'string') {
                    setError(result);
                } else {
                    setError('Could not fetch dealer information.');
                }
            } catch (err) {
                setError('An error occurred while fetching dealers.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDealers();
    }, [coords, language]);
    
    const sortedDealers = useMemo(() => {
        const dealersToSort = [...dealers];
        if (sortByRating) {
            dealersToSort.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        }
        return dealersToSort;
    }, [dealers, sortByRating]);

    if (isLocating) {
        return (
            <div className="p-4 text-center">
                <Card>
                    <div className="flex flex-col items-center justify-center p-4">
                        <div className="w-8 h-8 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-2 text-gray-300">{t('gettingYourLocation')}</p>
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div className="p-4 space-y-4">
            <header className="text-center">
                <h1 className="text-3xl font-bold text-white">{t('dealerLocatorTitle')}</h1>
                <p className="text-gray-300">{t('dealerLocatorSubtitle')}</p>
            </header>

            <Card>
                <div className="relative w-full h-64 md:h-80 bg-gray-900 rounded-lg overflow-hidden border border-white/10">
                     <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('https://i.imgur.com/2A2n35k.png')` }}>
                        {sortedDealers.map((dealer, index) => (
                            <div 
                                key={index} 
                                style={{ top: `${dealer.coordinates.lat % 1 * 80 + 10}%`, left: `${dealer.coordinates.lon % 1 * 80 + 10}%` }} 
                                className="absolute transform -translate-x-1/2 -translate-y-1/2" 
                                onClick={() => setSelectedDealerIndex(index === selectedDealerIndex ? null : index)}
                            >
                                <MapPinIcon className="h-8 w-8 text-red-500 drop-shadow-lg cursor-pointer transition-transform hover:scale-125" />
                                {selectedDealerIndex === index && (
                                    <div className="absolute bottom-full mb-2 w-48 bg-gray-800 text-white text-xs rounded-md p-2 shadow-lg z-10 animate-fade-in-down">
                                        <p className="font-bold">{dealer.name}</p>
                                        {dealer.rating != null && <StarRating rating={dealer.rating} />}
                                    </div>
                                )}
                            </div>
                        ))}
                     </div>
                </div>
            </Card>

            <div className="flex justify-end">
                <button 
                    onClick={() => setSortByRating(!sortByRating)} 
                    className={`font-bold py-2 px-4 rounded-lg shadow-md transition-colors ${sortByRating ? 'bg-brand-yellow text-brand-dark' : 'bg-brand-green hover:bg-brand-green-light text-white'}`}
                >
                    {t('sortByRating')}
                </button>
            </div>
            
            {isLoading && (
                 <Card>
                    <div className="flex flex-col items-center justify-center p-4">
                        <div className="w-8 h-8 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-2 text-gray-300">{t('fetchingDealers')}</p>
                    </div>
                </Card>
            )}

            {error && <p className="text-red-400 text-center">{error}</p>}
            
            {!isLoading && sortedDealers.length > 0 && (
                <div className="space-y-3">
                    {sortedDealers.map((dealer, index) => (
                        <Card key={index}>
                            <h3 className="text-lg font-bold text-white">{dealer.name}</h3>
                            <p className="text-sm text-gray-400 mt-1">{dealer.address}</p>
                            {dealer.phone && <a href={`tel:${dealer.phone}`} className="text-sm text-brand-yellow hover:underline mt-1 block">{dealer.phone}</a>}
                            {dealer.rating != null ? (
                                <div className="flex items-center mt-2">
                                    <span className="text-sm text-gray-300 mr-2">{t('rating')}:</span>
                                    <StarRating rating={dealer.rating} />
                                    <span className="ml-2 text-sm font-semibold text-yellow-400">{dealer.rating.toFixed(1)} / 5</span>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 mt-2">{t('noRatingAvailable')}</p>
                            )}
                        </Card>
                    ))}
                </div>
            )}
             {!isLoading && dealers.length === 0 && !error && (
                <Card>
                    <p className="text-center text-gray-400">No dealers found in your area.</p>
                </Card>
            )}
        </div>
    );
};

export default DealerLocatorPage;
