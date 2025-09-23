if (!MAPS_API_KEY) {
        console.error('Google Maps API key not found. Please set REACT_APP_GOOGLE_MAPS_API_KEY in your environment variables.');
        setError('Google Maps API key not configured. Maps functionality disabled.');
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setTimeout(() => {
          initializeMap();
        }, 100);
      };
      script.onerror = () => {
        console.error('Failed to load Google Maps API');
        setError('Failed to load Google Maps. Please check your API key configuration.');
      };
      document.head.appendChild(script);
    } else if (window.google && showMap && mapCenter) {
      initializeMap();
    }
  }, [showMap, mapCenter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="relative">
              <svg width="64" height="80" viewBox="0 0 64 80" className="drop-shadow-md">
                <path d="M32 0C20.4 0 11 9.4 11 21c0 15.8 21 35 21 35s21-19.2 21-35C53 9.4 43.6 0 32 0z" fill="#FF6A00"/>
                <circle cx="32" cy="21" r="12" fill="white" strokeWidth="2" stroke="#FF6A00"/>
                <circle cx="32" cy="21" r="8" fill="white" strokeWidth="2" stroke="#FF6A00"/>
                <circle cx="32" cy="21" r="4" fill="#FF6A00"/>
                <circle cx="32" cy="21" r="1.5" fill="white"/>
              </svg>
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-slate-800 leading-tight">
                Recomigo
              </h1>
              <p className="text-slate-600 text-base font-medium">Plan better. Meet smarter.</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-600 mt-1 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-semibold text-red-900">Error</h3>
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <MapPin className="text-orange-500" />
            Friend Locations
          </h2>
          
          {friends.map((friend, index) => (
            <div key={friend.id} className="flex gap-3 mb-3">
              <input
                type="text"
                placeholder={`Friend ${index + 1} name`}
                value={friend.name}
                onChange={(e) => updateFriend(friend.id, 'name', e.target.value)}
                className="w-28 sm:w-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 flex-shrink-0"
              />
              <input
                type="text"
                placeholder="Full address, postcode, or 'City, Country'"
                value={friend.location}
                onChange={(e) => updateFriend(friend.id, 'location', e.target.value)}
                className="flex-1 min-w-0 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              {friends.length > 2 && (
                <button
                  onClick={() => removeFriend(friend.id)}
                  className="p-4 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          ))}
          
          {friends.length < 4 && (
            <button
              onClick={addFriend}
              className="flex items-center gap-2 text-orange-600 hover:text-orange-800 font-medium mt-2"
            >
              <Plus size={20} />
              Add another friend
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Clock className="text-orange-500" />
            When & How
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meetup Date & Time
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={meetupDateTime.slice(0, 10)}
                  onChange={(e) => {
                    const currentTime = meetupDateTime.slice(11);
                    setMeetupDateTime(`${e.target.value}T${currentTime}`);
                  }}
                  className="p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  min={new Date().toISOString().slice(0, 10)}
                />
                <select
                  value={meetupDateTime.slice(11, 16)}
                  onChange={(e) => {
                    const currentDate = meetupDateTime.slice(0, 10);
                    setMeetupDateTime(`${currentDate}T${e.target.value}`);
                  }}
                  className="p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  {timeOptions.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Travel times and venue hours will be calculated for this time
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transport Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                {transportOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = transport === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => setTransport(option.id)}
                      className={`p-3 rounded-lg border-2 transition-all duration-300 text-sm ${
                        isSelected
                          ? 'border-slate-600 bg-slate-100 text-slate-800 shadow-lg ring-2 ring-slate-300'
                          : 'border-gray-200 bg-white hover:border-slate-400 hover:shadow-md'
                      }`}
                    >
                      <Icon className={`mx-auto mb-1 ${isSelected ? 'text-slate-700' : 'text-gray-600'}`} size={18} />
                      <div className={`font-medium ${isSelected ? 'text-slate-800' : 'text-gray-900'}`}>{option.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Coffee className="text-orange-500" />
            Activity Preferences
          </h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Search (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Italian restaurant, gym, bowling, coffee shop, spa, pizza..."
              value={customSearch}
              onChange={(e) => setCustomSearch(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {activityOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = activities.includes(option.id);
              return (
                <button
                  key={option.id}
                  onClick={() => toggleActivity(option.id)}
                  className={`p-5 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                    isSelected
                      ? 'border-orange-500 bg-orange-100 text-orange-700 shadow-lg ring-2 ring-orange-200'
                      : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-md'
                  }`}
                >
                  <Icon className={`mx-auto mb-2 ${isSelected ? 'text-orange-600' : 'text-gray-600'}`} size={24} />
                  <div className={`font-medium ${isSelected ? 'text-orange-700' : 'text-gray-900'}`}>{option.label}</div>
                </button>
              );
            })}
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4 text-gray-900">Additional Filters</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {additionalFilterOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = additionalFilters.includes(option.id);
                return (
                  <button
                    key={option.id}
                    onClick={() => toggleAdditionalFilter(option.id)}
                    className={`p-3 rounded-lg border-2 transition-all duration-300 text-sm ${
                      isSelected
                        ? 'border-slate-700 bg-slate-800 text-white shadow-lg ring-2 ring-slate-400'
                        : 'border-gray-200 bg-white hover:border-slate-400 hover:shadow-sm'
                    }`}
                  >
                    <Icon className={`mx-auto mb-1 ${isSelected ? 'text-white' : 'text-gray-600'}`} size={18} />
                    <div className={`font-medium ${isSelected ? 'text-white' : 'text-gray-900'}`}>{option.label}</div>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Additional filters help narrow down venue options (availability may vary by location)
            </p>
          </div>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={findOptimalMeetups}
            disabled={!canSearch || isLoading}
            className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all transform ${
              canSearch && !isLoading
                ? 'bg-orange-500 hover:bg-orange-600 shadow-lg hover:shadow-xl hover:scale-105'
                : 'bg-gray-300 cursor-not-allowed'
            } text-white`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                Finding perfect meetup spots...
              </span>
            ) : (
              'Find Perfect Meetup Spots'
            )}
          </button>
        </div>

        {analysisDetails && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-semibold text-green-900 mb-2">Analysis Complete</h3>
                <div className="text-green-800 text-sm space-y-1">
                  <div>✓ Geocoded {analysisDetails.friendsGeocoded} locations</div>
                  <div>✓ Found {analysisDetails.venuesFound} venues via Places API</div>
                  <div>✓ Analyzed {analysisDetails.venuesAnalyzed} venues with real travel times</div>
                  <div>✓ Transport mode: {analysisDetails.transportMode}</div>
                  <div>✓ Search center: {analysisDetails.centerPoint} ({analysisDetails.isRouteBased ? 'route-optimized' : 'geographic'})</div>
                  {analysisDetails.totalTravelTime && (
                    <div>✓ Total travel time to center: {analysisDetails.totalTravelTime.toFixed(1)} minutes</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Share Meetup Plan</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Share this link with your friends so they can see the same meetup recommendations:
              </p>
              
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={shareableUrl}
                  readOnly
                  className="flex-1 p-3 border border-gray-300 rounded-lg text-sm bg-gray-50"
                />
                <button
                  onClick={() => copyToClipboard(shareableUrl)}
                  className="px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  {copySuccess ? <CheckCircle size={16} /> : <Copy size={16} />}
                  {copySuccess ? 'Copied!' : 'Copy'}
                </button>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Meetup Plan - Recomigo',
                        text: 'Check out these meetup recommendations!',
                        url: shareableUrl
                      });
                    } else {
                      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out these meetup recommendations!')}&url=${encodeURIComponent(shareableUrl)}`);
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <ExternalLink size={16} />
                  Share
                </button>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {recommendations.length > 0 && (
          <>
            <div ref={resultsRef} className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Clock className="text-orange-500" />
                  Recommended Meetup Spots
                </h2>
                <div className="flex gap-2">
                  {availableRoutes.length > 1 && (
                    <button
                      onClick={searchDifferentRoute}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      🔄 Search Different Route ({currentRouteIndex + 1} of {availableRoutes.length})
                    </button>
                  )}
                  <button
                    onClick={() => {
                      const shareUrl = generateShareableUrl();
                      setShowShareModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Share2 size={20} />
                    Share Plan
                  </button>
                  <button
                    onClick={() => setShowMap(!showMap)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    <Map size={20} />
                    {showMap ? 'Hide Map' : 'Show Map'}
                  </button>
                </div>
              </div>

              {showMap && (
                <div className="mb-8">
                  <div 
                    ref={mapRef}
                    className="w-full h-96 rounded-lg border border-gray-200"
                    style={{ minHeight: '400px' }}
                  />
                  <div className="flex flex-wrap gap-4 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-slate-800 rounded-full border-2 border-white"></div>
                      <span>Friend locations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">1</div>
                      <span>Recommended venues (ranked)</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid gap-6">
                {recommendations.map((spot, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Venue Photo */}
                      {spot.photos && spot.photos.length > 0 && (
                        <div className="lg:w-64 flex-shrink-0">
                          <img
                            src={getPhotoUrl(spot.photos[0].photo_reference, 300)}
                            alt={spot.name}
                            className="w-full h-48 lg:h-40 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                          {spot.photos.length > 1 && (
                            <div className="flex gap-2 mt-2">
                              {spot.photos.slice(1, 3).map((photo, photoIndex) => (
                                <img
                                  key={photoIndex}
                                  src={getPhotoUrl(photo.photo_reference, 150)}
                                  alt={`${spot.name} ${photoIndex + 2}`}
                                  className="w-16 h-16 object-cover rounded-lg"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Venue Details */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-xl text-gray-900 mb-1">
                              #{index + 1} {spot.name}
                            </h3>
                            <p className="text-sm text-gray-500 mb-2">{spot.address}</p>
                            <p className="text-sm text-gray-500">
                              ⭐ {spot.rating} • {'£'.repeat(spot.priceLevel)}
                            </p>
                            
                            <div className="mt-2">
                              {spot.openingStatus?.isOpen === true && spot.openingStatus?.closingTime && (
                                <div className="flex items-center gap-2 text-sm">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span className="text-green-700 font-medium">
                                    Open until {spot.openingStatus.closingTime}
                                  </span>
                                </div>
                              )}
                              
                              {spot.openingStatus?.isOpen === false && (
                                <div className="flex items-center gap-2 text-sm">
                                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                  <span className="text-red-700 font-medium">
                                    Closed at your selected time
                                  </span>
                                </div>
                              )}
                              
                              {(spot.openingStatus?.isOpen === null || spot.hasUnknownHours) && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
                                  <div className="flex items-start gap-2">
                                    <AlertCircle className="text-yellow-600 mt-0.5 flex-shrink-0" size={16} />
                                    <div className="text-sm">
                                      <p className="text-yellow-800 font-medium">Opening hours unknown</p>
                                      <p className="text-yellow-700">
                                        Please verify this venue is open at {new Date(meetupDateTime).toLocaleString('en-GB', { 
                                          weekday: 'short', 
                                          day: 'numeric', 
                                          month: 'short',
                                          hour: '2-digit', 
                                          minute: '2-digit' 
                                        })} before finalizing your plans.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Venue links */}
                              <div className="flex gap-3 mt-3">
                                {spot.details?.website && (
                                  <a 
                                    href={spot.details.website} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                                  >
                                    🌐 Website
                                  </a>
                                )}
                                <a 
                                  href={`https://www.google.com/maps/place/?q=place_id:${spot.place_id}`}
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                                >
                                  ℹ️ More info
                                </a>
                                {spot.details?.formatted_phone_number && (
                                  isMobileDevice() ? (
                                    <a 
                                      href={`tel:${spot.details.formatted_phone_number}`}
                                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                                    >
                                      📞 Call
                                    </a>
                                  ) : (
                                    <span className="text-gray-600 text-sm flex items-center gap-1">
                                      📞 {spot.details.formatted_phone_number}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-center bg-orange-50 px-4 py-3 rounded-lg border border-orange-200 sm:text-right">
                            <div className="text-sm text-orange-600 font-medium">Max travel time</div>
                            <div className="font-bold text-2xl text-orange-700">{spot.maxTravelTime} min</div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                            <div className="text-center bg-white p-4 rounded-lg border border-gray-100">
                              <div className="text-xl font-bold text-gray-900">{spot.avgTravelTime} min</div>
                              <div className="text-sm text-gray-600">Average time</div>
                            </div>
                            <div className="text-center bg-white p-4 rounded-lg border border-gray-100">
                              <div className="text-xl font-bold text-gray-900">{spot.fairnessScore} min</div>
                              <div className="text-sm text-gray-600">Time difference</div>
                            </div>
                            <div className="text-center bg-white p-4 rounded-lg border border-gray-100">
                              <div className="text-xl font-bold text-gray-900">{spot.minTravelTime} min</div>
                              <div className="text-sm text-gray-600">Shortest journey</div>
                            </div>
                          </div>
                          
                          <div className="border-t border-gray-200 pt-4">
                            <div className="text-sm text-gray-600 mb-3 font-medium">Individual journey details:</div>
                            <div className="space-y-2">
                              {spot.travelDetails?.map((journey, i) => (
                                <div key={i} className="flex justify-between items-center bg-white px-4 py-3 rounded-lg border border-gray-100 text-sm">
                                  <span className="font-medium text-gray-900">{journey.friend}</span>
                                  <div className="flex items-center gap-3">
                                    <span className="text-gray-600">{journey.duration} min • {journey.distance} km</span>
                                    <button
                                      onClick={() => {
                                        const friendLocation = friendLocations.find(f => f.name === journey.friend);
                                        if (friendLocation) {
                                          const googleDirFlag = transport === 'driving' ? 'd' : 
                                                               transport === 'walking' ? 'w' : 
                                                               transport === 'bicycling' ? 'b' : 
                                                               transport === 'transit' ? 'r' : 'd';
                                          
                                          const directionsUrl = `https://www.google.com/maps/dir/${friendLocation.lat},${friendLocation.lng}/${spot.coords.lat},${spot.coords.lng}?dirflg=${googleDirFlag}`;
                                          window.open(directionsUrl, '_blank');
                                        }
                                      }}
                                      className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                                    >
                                      Directions
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="mt-4 pt-3 border-t border-gray-200">
                              <button
                                onClick={() => {
                                  const googleDirFlag = transport === 'driving' ? 'd' : 
                                                       transport === 'walking' ? 'w' : 
                                                       transport === 'bicycling' ? 'b' : 
                                                       transport === 'transit' ? 'r' : 'd';
                                  
                                  const waypoints = friendLocations.map(friend => `${friend.lat},${friend.lng}`).join('/');
                                  const destination = `${spot.coords.lat},${spot.coords.lng}`;
                                  const mapsUrl = `https://www.google.com/maps/dir/${waypoints}/${destination}?dirflg=${googleDirFlag}`;
                                  window.open(mapsUrl, '_blank');
                                }}
                                className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                              >
                                <Navigation size={16} />
                                Get Directions for Everyone
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {allScoredVenues.length > recommendations.length && (
                <div className="mt-8 text-center">
                  <button
                    onClick={() => {
                      const currentCount = recommendations.length;
                      const newCount = Math.min(currentCount + 5, allScoredVenues.length);
                      setRecommendations(allScoredVenues.slice(0, newCount));
                    }}
                    className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2 mx-auto"
                  >
                    <MapPin size={18} />
                    Show More Venues ({Math.min(5, allScoredVenues.length - recommendations.length)} more available)
                  </button>
                  <p className="text-sm text-gray-500 mt-2">
                    Showing {recommendations.length} of {allScoredVenues.length} venues found
                  </p>
                </div>
              )}
              
              {recommendations.length >= allScoredVenues.length && allScoredVenues.length > 5 && (
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Showing all {allScoredVenues.length} venues found in this area
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;      return {
        lat: (friend1.lat + friend2.lat) / 2,
        lng: (friend1.lng + friend2.lng) / 2,
        isRouteBased: false,
        totalTravelTime: null
      };
    }
  };

  const getVenueDetails = async (placeId) => {
    try {
      const response = await fetch(
        `https://meetup-backend-xqtj.onrender.com/api/placedetails?place_id=${placeId}`
      );
      const data = await response.json();
      
      if (data.status === 'OK') {
        return {
          opening_hours: data.result.opening_hours,
          formatted_phone_number: data.result.formatted_phone_number,
          website: data.result.website
        };
      }
      return null;
    } catch (error) {
      console.warn('Error getting venue details:', error);
      return null;
    }
  };

  // Check if venue is open at specified time, considering timezone
  const isVenueOpenAt = (openingHours, dateTime, timezone = null) => {
    if (!openingHours || !openingHours.periods || !Array.isArray(openingHours.periods)) {
      return { isOpen: null, closingTime: null, isUnknown: true };
    }

    // Convert to local timezone if provided
    let checkDate;
    if (timezone) {
      try {
        checkDate = new Date(new Date(dateTime).toLocaleString("en-US", {timeZone: timezone}));
      } catch (error) {
        console.warn('Timezone conversion failed for opening hours:', error);
        checkDate = new Date(dateTime);
      }
    } else {
      checkDate = new Date(dateTime);
    }

    const dayOfWeek = checkDate.getDay();
    const hours = checkDate.getHours();
    const minutes = checkDate.getMinutes();
    const timeOfDay = hours * 100 + minutes;

    const todayPeriods = openingHours.periods.filter(period => {
      return period.open && typeof period.open.day === 'number' && period.open.day === dayOfWeek;
    });

    if (todayPeriods.length === 0) {
      return { isOpen: false, closingTime: null };
    }

    for (const period of todayPeriods) {
      if (!period.open || typeof period.open.time !== 'string') {
        continue;
      }
      
      const openTimeStr = period.open.time.padStart(4, '0');
      const openTime = parseInt(openTimeStr) || 0;
      
      let closeTime = 2359;
      let closeTimeStr = '2359';
      
      if (period.close && typeof period.close.time === 'string') {
        closeTimeStr = period.close.time.padStart(4, '0');
        closeTime = parseInt(closeTimeStr) || 0;
      }
      
      if (closeTime === 0) {
        closeTime = 2400;
        closeTimeStr = '2400';
      }
      
      if (period.close && (period.close.day !== dayOfWeek || closeTime === 2400)) {
        if (timeOfDay >= openTime || (closeTime !== 2400 && timeOfDay <= closeTime)) {
          const displayCloseTime = closeTime === 2400 ? '00:00' : `${Math.floor(closeTime/100).toString().padStart(2, '0')}:${(closeTime%100).toString().padStart(2, '0')}`;
          return { isOpen: true, closingTime: displayCloseTime };
        }
      } else {
        if (timeOfDay >= openTime && timeOfDay < closeTime) {
          return { 
            isOpen: true, 
            closingTime: `${Math.floor(closeTime/100).toString().padStart(2, '0')}:${(closeTime%100).toString().padStart(2, '0')}`
          };
        }
      }
    }

    return { isOpen: false, closingTime: null };
  };

  const findVenuesNearby = async (centerLat, centerLng, activityTypes, customSearchTerm = '', transitStations = null, optimalCenter = null) => {
    const allVenues = [];
    
    try {
      let finalSearchTerm = customSearchTerm.trim();
      
      if (!finalSearchTerm && activityTypes.length > 0) {
        const activityWords = activityTypes.map(type => {
          switch(type) {
            case 'pub': return 'pub';
            case 'restaurant': return 'restaurant';
            case 'outdoor': return 'outdoor space park';
            case 'indoor': return 'indoor activity';
            default: return type;
          }
        }).join(' ');
        finalSearchTerm = activityWords;
      }
      
      if (additionalFilters.length > 0) {
        const filterWords = additionalFilters.map(filterId => {
          switch(filterId) {
            case 'parking': return 'with parking';
            case 'family': return 'family friendly';
            case 'dog': return 'dog friendly';
            case 'romantic': return 'romantic';
            case 'waterfront': return 'waterfront';
            case 'rooftop': return 'rooftop beer garden';
            default: return filterId;
          }
        }).join(' ');
        
        finalSearchTerm = finalSearchTerm ? `${filterWords} ${finalSearchTerm}` : filterWords;
      }

      if (transitStations && transitStations.length > 0) {
        // Transit-optimized search: prioritize selected optimal station
        const optimalStation = optimalCenter?.selectedOptimalStation;
        
        if (optimalStation) {
          try {
            const searchRadius = 1500; // 1.5km radius
            
            let apiUrl;
            if (finalSearchTerm) {
              apiUrl = `https://meetup-backend-xqtj.onrender.com/api/places?lat=${optimalStation.location.lat}&lng=${optimalStation.location.lng}&radius=${searchRadius}&keyword=${encodeURIComponent(finalSearchTerm)}`;
            } else {
              apiUrl = `https://meetup-backend-xqtj.onrender.com/api/places?lat=${optimalStation.location.lat}&lng=${optimalStation.location.lng}&radius=${searchRadius}&type=restaurant`;
            }
            
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            if (data.status === 'OK') {
              const venues = data.results
                .filter(place => place.rating && place.rating >= 3.0)
                .slice(0, 15) // Get more venues since this is the optimal station
                .map(place => ({
                  place_id: place.place_id,
                  name: place.name,
                  type: customSearchTerm ? 'custom' : 'filtered',
                  rating: place.rating,
                  priceLevel: place.price_level || 2,
                  coords: place.geometry.location,
                  address: place.vicinity,
                  photos: place.photos ? place.photos.slice(0, 3) : [], // Get up to 3 photos
                  googleTypes: place.types || [],
                  nearestStation: optimalStation.name,
                  isFromOptimalStation: true
                }));
              
              allVenues.push(...venues);
              
              // If we found enough venues at the optimal station, we can stop here
              if (venues.length >= 8) {
                // Continue with other stations for variety if needed
              } else {
                // Search 2 nearby stations for additional options
                const nearbyStations = transitStations
                  .filter(station => station.name !== optimalStation.name) // Exclude the optimal station
                  .sort((a, b) => Math.abs(a.time - optimalStation.time) - Math.abs(b.time - optimalStation.time)) // Closest by time
                  .slice(0, 2);
                
                for (const nearbyStation of nearbyStations) {
                  try {
                    let nearbyApiUrl;
                    if (finalSearchTerm) {
                      nearbyApiUrl = `https://meetup-backend-xqtj.onrender.com/api/places?lat=${nearbyStation.location.lat}&lng=${nearbyStation.location.lng}&radius=${searchRadius}&keyword=${encodeURIComponent(finalSearchTerm)}`;
                    } else {
                      nearbyApiUrl = `https://meetup-backend-xqtj.onrender.com/api/places?lat=${nearbyStation.location.lat}&lng=${nearbyStation.location.lng}&radius=${searchRadius}&type=restaurant`;
                    }
                    
                    const nearbyResponse = await fetch(nearbyApiUrl);
                    const nearbyData = await nearbyResponse.json();
                    
                    if (nearbyData.status === 'OK') {
                      const nearbyVenues = nearbyData.results
                        .filter(place => place.rating && place.rating >= 3.0)
                        .slice(0, 5)
                        .map(place => ({
                          place_id: place.place_id,
                          name: place.name,
                          type: customSearchTerm ? 'custom' : 'filtered',
                          rating: place.rating,
                          priceLevel: place.price_level || 2,
                          coords: place.geometry.location,
                          address: place.vicinity,
                          photos: place.photos ? place.photos.slice(0, 3) : [],
                          googleTypes: place.types || [],
                          nearestStation: nearbyStation.name
                        }));
                      
                      allVenues.push(...nearbyVenues);
                    }
                    
                    await new Promise(resolve => setTimeout(resolve, 100));
                  } catch (error) {
                    console.warn(`Error searching near ${nearbyStation.name}:`, error);
                  }
                }
              }
            }
            
          } catch (error) {
            console.warn(`Error searching near optimal station ${optimalStation.name}:`, error);
          }
          
        } else {
          // Fallback to the old multi-station search if no optimal station selected
          // Get target time for weighting
          const totalTime = transitStations[transitStations.length - 1]?.time || 3600;
          const targetTime = totalTime / 2;
          
          // Search around key stations (prioritize those near midpoint)
          const prioritizedStations = transitStations
            .filter(station => Math.abs(station.time - targetTime) <= 1200) // Within 20 min of midpoint
            .sort((a, b) => Math.abs(a.time - targetTime) - Math.abs(b.time - targetTime)) // Closest to midpoint first
            .slice(0, 8); // Limit to prevent too many API calls
          
          for (const station of prioritizedStations) {
            try {
              const searchRadius = 1500; // Fixed 1.5km radius
              
              let apiUrl;
              if (finalSearchTerm) {
                apiUrl = `https://meetup-backend-xqtj.onrender.com/api/places?lat=${station.location.lat}&lng=${station.location.lng}&radius=${searchRadius}&keyword=${encodeURIComponent(finalSearchTerm)}`;
              } else {
                apiUrl = `https://meetup-backend-xqtj.onrender.com/api/places?lat=${station.location.lat}&lng=${station.location.lng}&radius=${searchRadius}&type=restaurant`;
              }
              
              const response = await fetch(apiUrl);
              const data = await response.json();
              
              if (data.status === 'OK') {
                const venues = data.results
                  .filter(place => place.rating && place.rating >= 3.0)
                  .slice(0, 8)
                  .map(place => ({
                    place_id: place.place_id,
                    name: place.name,
                    type: customSearchTerm ? 'custom' : 'filtered',
                    rating: place.rating,
                    priceLevel: place.price_level || 2,
                    coords: place.geometry.location,
                    address: place.vicinity,
                    photos: place.photos ? place.photos.slice(0, 3) : [],
                    googleTypes: place.types || [],
                    nearestStation: station.name,
                    distanceFromMidpoint: Math.abs(station.time - targetTime) / 60
                  }));
                
                allVenues.push(...venues);
                
                if (venues.length >= 5) {
                  break;
                }
              }
              
              await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
              console.warn(`Error searching near station ${station.name}:`, error);
            }
          }
        }
        
      } else {
        // Regular radius-based search for non-transit modes
        const radii = [2000, 5000, 8000];
        
        if (finalSearchTerm) {
          for (const radius of radii) {
            try {
              const response = await fetch(
                `https://meetup-backend-xqtj.onrender.com/api/places?lat=${centerLat}&lng=${centerLng}&radius=${radius}&keyword=${encodeURIComponent(finalSearchTerm)}`
              );
              const data = await response.json();
              
              if (data.status === 'OK') {
                const venues = data.results
                  .filter(place => place.rating && place.rating >= 3.0)
                  .slice(0, 12)
                  .map(place => ({
                    place_id: place.place_id,
                    name: place.name,
                    type: customSearchTerm ? 'custom' : 'filtered',
                    rating: place.rating,
                    priceLevel: place.price_level || 2,
                    coords: place.geometry.location,
                    address: place.vicinity,
                    photos: place.photos ? place.photos.slice(0, 3) : [],
                    googleTypes: place.types || [] // Include Google types
                  }));
                
                allVenues.push(...venues);
              }
              
              await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
              console.warn(`Error searching for keyword "${finalSearchTerm}":`, error);
            }
          }
        }
        
        if (allVenues.length === 0 && activityTypes.length > 0) {
          for (const radius of radii) {
            for (const activityType of activityTypes) {
              const googleTypes = activityOptions.find(a => a.id === activityType)?.googleTypes || ['restaurant'];
              
              for (const placeType of googleTypes) {
                try {
                  const response = await fetch(
                    `https://meetup-backend-xqtj.onrender.com/api/places?lat=${centerLat}&lng=${centerLng}&radius=${radius}&type=${placeType}`
                  );
                  const data = await response.json();
                  
                  if (data.status === 'OK') {
                    const venues = data.results
                      .filter(place => place.rating && place.rating >= 3.5)
                      .slice(0, 6)
                      .map(place => ({
                        place_id: place.place_id,
                        name: place.name,
                        type: activityType,
                        rating: place.rating,
                        priceLevel: place.price_level || 2,
                        coords: place.geometry.location,
                        address: place.vicinity,
                        photos: place.photos ? place.photos.slice(0, 3) : []
                      }));
                    
                    allVenues.push(...venues);
                  }
                  
                  await new Promise(resolve => setTimeout(resolve, 100));
                } catch (error) {
                  console.warn(`Error searching for ${placeType}:`, error);
                }
              }
            }
            
            if (allVenues.length >= 20) break;
          }
        }
      }
      
      const uniqueVenues = allVenues.filter((venue, index, self) => 
        index === self.findIndex(v => v.place_id === venue.place_id)
      );
      
      // Fallback: if transit search found nothing, do regular radius search
      if (transitStations && uniqueVenues.length === 0) {
        return await findVenuesNearby(centerLat, centerLng, activityTypes, customSearchTerm, null);
      }
      
      return uniqueVenues.slice(0, 25);
      
    } catch (error) {
      console.error('Places API error:', error);
      throw error;
    }
  };

  const calculateTravelTimes = async (origins, destinations, mode, departureTime = null) => {
    try {
      const originsStr = origins.map(coord => `${coord.lat},${coord.lng}`).join('|');
      const destinationsStr = destinations.map(coord => `${coord.lat},${coord.lng}`).join('|');
      
      let url = `https://meetup-backend-xqtj.onrender.com/api/distancematrix?origins=${encodeURIComponent(originsStr)}&destinations=${encodeURIComponent(destinationsStr)}&mode=${mode}&units=metric`;
      
      // Always use the provided departure time (your planned meetup time)
      if (departureTime) {
        const timestamp = Math.floor(new Date(departureTime).getTime() / 1000);
        url += `&departure_time=${timestamp}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === 'OK') {
        return data.rows.map(row => 
          row.elements.map(element => ({
            duration: element.status === 'OK' ? element.duration.value / 60 : null,
            distance: element.status === 'OK' ? element.distance.value / 1000 : null,
            status: element.status
          }))
        );
      } else {
        throw new Error(`Distance Matrix API error: ${data.status}`);
      }
    } catch (error) {
      console.error('Distance Matrix error:', error);
      throw error;
    }
  };

  const findOptimalMeetups = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysisDetails(null);
    
    try {
      const validFriends = friends.filter(f => f.location.trim() !== '');
      const selectedActivityTypes = activities.length > 0 ? activities : ['pub'];
      
      const friendCoords = [];
      let targetTimezone = null;
      
      for (const friend of validFriends) {
        const coords = await geocodeAddress(friend.location);
        
        // Use the first friend's timezone as the target timezone
        if (!targetTimezone && coords.timezone) {
          targetTimezone = coords.timezone;
        }
        
        friendCoords.push({
          ...coords,
          name: friend.name || `Friend at ${friend.location}`
        });
      }
      
      // Convert meetup time to the location's timezone
      const localMeetupTime = targetTimezone ? 
        convertToLocalTime(meetupDateTime, targetTimezone) : 
        meetupDateTime;
      
      const optimalCenter = await findOptimalMeetingPoint(friendCoords, transport, localMeetupTime);
      
      const venues = await findVenuesNearby(
        optimalCenter.lat, 
        optimalCenter.lng, 
        selectedActivityTypes, 
        customSearch,
        optimalCenter.transitStations || null,
        optimalCenter // Pass the entire optimalCenter object which now contains selectedOptimalStation
      );
      
      if (venues.length === 0) {
        throw new Error('No suitable venues found in the area');
      }
      
      const travelMatrix = await calculateTravelTimes(
        friendCoords,
        venues.map(v => v.coords),
        transport,
        localMeetupTime // Use the timezone-converted time
      );
      
      const venuesWithDetails = [];
      for (let i = 0; i < Math.min(venues.length, 10); i++) {
        const venue = venues[i];
        const details = await getVenueDetails(venue.place_id);
        venuesWithDetails.push({
          ...venue,
          details,
          openingStatus: details ? isVenueOpenAt(details.opening_hours, localMeetupTime, targetTimezone) : { isOpen: null, closingTime: null }
        });
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      if (venues.length > 10) {
        const remainingVenues = venues.slice(10).map(venue => ({
          ...venue,
          details: null,
          openingStatus: { isOpen: null, closingTime: null }
        }));
        venuesWithDetails.push(...remainingVenues);
      }
      
      const openVenues = [];
      const closedVenues = [];
      
      for (let venueIndex = 0; venueIndex < venuesWithDetails.length; venueIndex++) {
        const venue = venuesWithDetails[venueIndex];
        const travelTimes = [];
        
        for (let friendIndex = 0; friendIndex < friendCoords.length; friendIndex++) {
          const travelTime = travelMatrix[friendIndex] && travelMatrix[friendIndex][venueIndex];
          
          if (travelTime && travelTime.status === 'OK' && travelTime.duration) {
            travelTimes.push({
              friend: friendCoords[friendIndex].name,
              duration: Math.round(travelTime.duration),
              distance: Math.round(travelTime.distance * 10) / 10
            });
          }
        }
        
        if (travelTimes.length === friendCoords.length) {
          const durations = travelTimes.map(t => t.duration);
          const maxTime = Math.max(...durations);
          const avgTime = durations.reduce((sum, time) => sum + time, 0) / durations.length;
          const fairnessScore = maxTime - Math.min(...durations);
          
          // Simple scoring system (keeping what works)
          let score = (
            Math.max(0, 120 - maxTime) * 0.4 +
            Math.max(0, 90 - avgTime) * 0.3 +
            Math.max(0, 60 - fairnessScore) * 0.2 +
            (venue.rating - 1) * 20 * 0.1
          );
          
          const venueData = {
            ...venue,
            maxTravelTime: Math.round(maxTime),
            avgTravelTime: Math.round(avgTime),
            minTravelTime: Math.round(Math.min(...durations)),
            fairnessScore: Math.round(fairnessScore),
            score: Math.round(score * 100) / 100,
            travelDetails: travelTimes
          };
          
          if (venue.openingStatus?.isOpen === true) {
            openVenues.push(venueData);
          } else if (venue.openingStatus?.isOpen === false) {
            closedVenues.push(venueData);
          } else {
            const unknownVenue = {
              ...venueData,
              hasUnknownHours: true,
              score: venueData.score * 0.8,
              openingStatus: { isOpen: null, closingTime: null, isUnknown: true }
            };
            openVenues.push(unknownVenue);
          }
        }
      }
      
      if (openVenues.length === 0) {
        throw new Error(`No venues are open at ${new Date(meetupDateTime).toLocaleString('en-GB', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long',
          hour: '2-digit', 
          minute: '2-digit' 
        })}. Please try a different time or day when venues are typically open.`);
      } else if (openVenues.length < 3) {
        setError(`Only ${openVenues.length} venue${openVenues.length === 1 ? ' is' : 's are'} open at your selected time. Consider choosing a different time for more options.`);
      }
      
      // Sort open venues by score 
      const sortedOpenVenues = openVenues.sort((a, b) => b.score - a.score);
      
      // Store all venues for potential "search wider" functionality
      setAllScoredVenues(sortedOpenVenues);
      
      // Show top 5 initially
      const topVenues = sortedOpenVenues.slice(0, 5);
      setRecommendations(topVenues);
      
      setAnalysisDetails({
        friendsGeocoded: friendCoords.length,
        venuesFound: venues.length,
        venuesAnalyzed: openVenues.length + closedVenues.length,
        transportMode: transportOptions.find(t => t.id === transport).label,
        centerPoint: `${optimalCenter.lat.toFixed(4)}, ${optimalCenter.lng.toFixed(4)}`,
        isRouteBased: optimalCenter.isRouteBased,
        totalTravelTime: optimalCenter.totalTravelTime
      });
      
      setMapCenter({ lat: optimalCenter.lat, lng: optimalCenter.lng });
      setFriendLocations(friendCoords);
      setShowMap(true);
      
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }, 500);
      
    } catch (error) {
      console.error('Analysis failed:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const searchDifferentRoute = () => {
    if (availableRoutes.length > 1) {
      const nextIndex = (currentRouteIndex + 1) % availableRoutes.length;
      setCurrentRouteIndex(nextIndex);
      
      // Trigger a new search with the different route
      findOptimalMeetups();
    }
  };

  const canSearch = friends.every(f => f.location.trim() !== '') && (activities.length > 0 || customSearch.trim() !== '');

  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const resultsRef = useRef(null);

  const initializeMap = () => {
    if (!mapRef.current || !mapCenter) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: mapCenter,
      zoom: 12,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ]
    });

    googleMapRef.current = map;
    let currentInfoWindow = null;

    friendLocations.forEach((friend, index) => {
      const friendMarker = new window.google.maps.Marker({
        position: { lat: friend.lat, lng: friend.lng },
        map: map,
        title: friend.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#1A2A3A',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2
        }
      });

      const friendInfoWindow = new window.google.maps.InfoWindow({
        content: `<div style="font-weight: bold; color: #1A2A3A; padding: 5px;">${friend.name}<br><span style="font-size: 12px; color: #666;">Friend Location</span></div>`
      });

      friendMarker.addListener('click', () => {
        if (currentInfoWindow) {
          currentInfoWindow.close();
        }
        friendInfoWindow.open(map, friendMarker);
        currentInfoWindow = friendInfoWindow;
      });
    });

    recommendations.forEach((venue, index) => {
      const marker = new window.google.maps.Marker({
        position: venue.coords,
        map: map,
        title: venue.name,
        label: {
          text: String(index + 1),
          color: 'white',
          fontWeight: 'bold'
        },
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: '#FF6A00',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2
        }
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="max-width: 250px;">
            <h3 style="margin: 0 0 8px 0; color: #1A2A3A; font-size: 16px;">#${index + 1} ${venue.name}</h3>
            <p style="margin: 4px 0; color: #666; font-size: 14px;">⭐ ${venue.rating} • ${'£'.repeat(venue.priceLevel)}</p>
            <p style="margin: 4px 0; color: #FF6A00; font-weight: bold; font-size: 14px;">Max travel: ${venue.maxTravelTime} min</p>
            <p style="margin: 4px 0; color: #666; font-size: 12px;">${venue.address}</p>
          </div>
        `
      });

      marker.addListener('click', () => {
        if (currentInfoWindow) {
          currentInfoWindow.close();
        }
        infoWindow.open(map, marker);
        currentInfoWindow = infoWindow;
      });
    });

    if (recommendations.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      
      recommendations.forEach((venue) => {
        const venuePos = { lat: venue.coords.lat, lng: venue.coords.lng };
        bounds.extend(venuePos);
      });
      
      if (recommendations.length === 1) {
        map.setCenter({ lat: recommendations[0].coords.lat, lng: recommendations[0].coords.lng });
        map.setZoom(15);
      } else {
        map.fitBounds(bounds, {
          top: 80,
          right: 80,
          bottom: 80,
          left: 80
        });
        
        window.google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
          const currentZoom = map.getZoom();
          
          if (currentZoom < 12) {
            map.setZoom(12);
          } else if (currentZoom > 18) {
            map.setZoom(18);
          }
        });
      }
    }
  };

  useEffect(() => {
    if (!window.google && showMap) {
      // Get API key from environment variable - this is the key fix!
      const MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
      
      if (!MAPS_API_KEY) {
        console.error('Google Maps API key not found. Please set REACT_APP_GOOGLE_MAPS_API_KEY in your environment variables.');
        setError('Google Maps API key not configured.import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Clock, Car, Bike, Navigation, Bus, Coffee, Utensils, TreePine, Activity, Plus, X, AlertCircle, CheckCircle, Map, Heart, Waves, Wine, SquareParking, Baby, Dog, Sun, Share2, Copy, ExternalLink } from 'lucide-react';

function App() {
  const [friends, setFriends] = useState([
    { id: 1, name: '', location: '' },
    { id: 2, name: '', location: '' }
  ]);
  const [transport, setTransport] = useState('driving');
  const [activities, setActivities] = useState([]);
  const [additionalFilters, setAdditionalFilters] = useState([]);
  const [customSearch, setCustomSearch] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [allScoredVenues, setAllScoredVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisDetails, setAnalysisDetails] = useState(null);
  const [error, setError] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [mapCenter, setMapCenter] = useState(null);
  const [friendLocations, setFriendLocations] = useState([]);
  const [currentRouteIndex, setCurrentRouteIndex] = useState(0);
  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [shareableUrl, setShareableUrl] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [meetupDateTime, setMeetupDateTime] = useState(() => {
    const defaultTime = new Date();
    defaultTime.setHours(defaultTime.getHours() + 2);
    const minutes = defaultTime.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 15) * 15;
    defaultTime.setMinutes(roundedMinutes, 0, 0);
    return defaultTime.toISOString().slice(0, 16);
  });

  // Load state from URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedData = urlParams.get('meetup');
    
    if (sharedData) {
      try {
        const decoded = JSON.parse(decodeURIComponent(sharedData));
        
        if (decoded.friends) setFriends(decoded.friends);
        if (decoded.transport) setTransport(decoded.transport);
        if (decoded.activities) setActivities(decoded.activities);
        if (decoded.additionalFilters) setAdditionalFilters(decoded.additionalFilters);
        if (decoded.customSearch) setCustomSearch(decoded.customSearch);
        if (decoded.meetupDateTime) setMeetupDateTime(decoded.meetupDateTime);
        
        // Auto-search if we have valid data
        if (decoded.friends && decoded.friends.every(f => f.location.trim() !== '')) {
          setTimeout(() => {
            findOptimalMeetups();
          }, 1000);
        }
      } catch (error) {
        console.warn('Failed to parse shared meetup data:', error);
      }
    }
  }, []);

  // Generate shareable URL
  const generateShareableUrl = () => {
    const meetupData = {
      friends: friends.filter(f => f.location.trim() !== ''),
      transport,
      activities,
      additionalFilters,
      customSearch,
      meetupDateTime
    };
    
    const encoded = encodeURIComponent(JSON.stringify(meetupData));
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = `${baseUrl}?meetup=${encoded}`;
    
    setShareableUrl(shareUrl);
    return shareUrl;
  };

  // Copy URL to clipboard
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  // Get photo URL from Google Places photo reference
  const getPhotoUrl = (photoReference, maxWidth = 400) => {
    if (!photoReference) return null;
    return `https://meetup-backend-xqtj.onrender.com/api/photo?photo_reference=${photoReference}&maxwidth=${maxWidth}`;
  };

  // Generate time options in 15-minute increments
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(timeString);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  const transportOptions = [
    { id: 'driving', icon: Car, label: 'Car', googleMode: 'driving' },
    { id: 'bicycling', icon: Bike, label: 'Bike', googleMode: 'bicycling' },
    { id: 'walking', icon: Navigation, label: 'Walk', googleMode: 'walking' },
    { id: 'transit', icon: Bus, label: 'Public Transport', googleMode: 'transit' }
  ];

  const activityOptions = [
    { id: 'pub', icon: Wine, label: 'Pub/Bar', googleTypes: ['bar', 'night_club'] },
    { id: 'restaurant', icon: Utensils, label: 'Restaurant', googleTypes: ['restaurant', 'meal_takeaway', 'cafe'] },
    { id: 'outdoor', icon: TreePine, label: 'Outdoor Space', googleTypes: ['park', 'tourist_attraction', 'campground'] },
    { id: 'indoor', icon: Activity, label: 'Indoor Activity', googleTypes: ['gym', 'spa', 'movie_theater', 'bowling_alley', 'museum', 'shopping_mall'] }
  ];

  const additionalFilterOptions = [
    { id: 'parking', icon: SquareParking, label: 'Parking Available', googleTypes: ['parking'] },
    { id: 'family', icon: Baby, label: 'Family Friendly', googleTypes: ['amusement_park', 'aquarium', 'zoo', 'park'] },
    { id: 'dog', icon: Dog, label: 'Dog Friendly', googleTypes: ['park', 'pet_store', 'veterinary_care'] },
    { id: 'romantic', icon: Heart, label: 'Romantic', googleTypes: ['restaurant', 'bar', 'spa'] },
    { id: 'waterfront', icon: Waves, label: 'Waterfront', googleTypes: ['tourist_attraction', 'lodging', 'restaurant'] },
    { id: 'rooftop', icon: Sun, label: 'Rooftop/Beer Garden', googleTypes: ['bar', 'restaurant', 'cafe'] }
  ];

  const addFriend = () => {
    if (friends.length < 4) {
      setFriends([...friends, { id: Date.now(), name: '', location: '' }]);
    }
  };

  const removeFriend = (id) => {
    if (friends.length > 2) {
      setFriends(friends.filter(friend => friend.id !== id));
    }
  };

  const updateFriend = (id, field, value) => {
    setFriends(friends.map(friend => 
      friend.id === id ? { ...friend, [field]: value } : friend
    ));
  };

  const toggleActivity = (activityId) => {
    setActivities(prev => 
      prev.includes(activityId) 
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  const toggleAdditionalFilter = (filterId) => {
    setAdditionalFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  // Geocode an address to get coordinates and timezone
  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(
        `https://meetup-backend-xqtj.onrender.com/api/geocode?address=${encodeURIComponent(address)}`
      );
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        const result = {
          lat: location.lat,
          lng: location.lng,
          formatted_address: data.results[0].formatted_address
        };
        
        // Get timezone for this location
        try {
          const timezoneResponse = await fetch(
            `https://meetup-backend-xqtj.onrender.com/api/timezone?location=${location.lat},${location.lng}&timestamp=${Math.floor(Date.now() / 1000)}`
          );
          const timezoneData = await timezoneResponse.json();
          
          if (timezoneData.status === 'OK') {
            result.timezone = timezoneData.timeZoneId;
            result.timezoneOffset = timezoneData.rawOffset + timezoneData.dstOffset;
          }
        } catch (timezoneError) {
          console.warn('Could not get timezone for location:', timezoneError);
        }
        
        return result;
      } else {
        throw new Error(`Geocoding failed for "${address}": ${data.status}`);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      throw error;
    }
  };

  // Convert meetup time to target timezone
  const convertToLocalTime = (meetupDateTime, targetTimezone) => {
    try {
      if (!targetTimezone) {
        console.warn('No timezone provided, using original time');
        return meetupDateTime;
      }

      // Parse the meetup time (assumes it's in user's local timezone)
      const userTime = new Date(meetupDateTime);
      
      // Convert to target timezone using Intl API
      const localTime = new Date(userTime.toLocaleString("en-US", {timeZone: targetTimezone}));
      const userTimeInUTC = new Date(userTime.toLocaleString("en-US", {timeZone: "UTC"}));
      const offset = userTimeInUTC.getTime() - localTime.getTime();
      const targetTime = new Date(userTime.getTime() + offset);
      
      return targetTime.toISOString();
    } catch (error) {
      console.warn('Timezone conversion failed:', error);
      return meetupDateTime;
    }
  };

  // Find optimal transit midpoint considering station importance and venue density
  const findTransitMidpoint = async (friend1, friend2, transportMode, departureTime) => {
    try {
      let url = `https://meetup-backend-xqtj.onrender.com/api/directions?origin=${friend1.lat},${friend1.lng}&destination=${friend2.lat},${friend2.lng}&mode=transit&alternatives=true`;
      
      if (departureTime) {
        const timestamp = Math.floor(new Date(departureTime).getTime() / 1000);
        url += `&departure_time=${timestamp}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === 'OK' && data.routes.length > 0) {
        // Store all available routes for "Search Different Route" functionality
        const allRoutes = data.routes;
        
        // Use the current route index (defaults to 0 for first search)
        const routeIndex = Math.min(currentRouteIndex, allRoutes.length - 1);
        const route = allRoutes[routeIndex];
        const legs = route.legs;
        
        // Store routes for the search again functionality
        if (allRoutes.length > 1) {
          setAvailableRoutes(allRoutes);
        }
        
        // Extract all transit stations from the route (prioritizing actual interchanges)
        const stations = [];
        const realInterchanges = []; // Track actual transfer points
        let cumulativeTime = 0;
        
        for (const leg of legs) {
          for (const step of leg.steps) {
            if (step.travel_mode === 'TRANSIT' && step.transit_details) {
              const departure = step.transit_details.departure_stop;
              const arrival = step.transit_details.arrival_stop;
              
              // Add departure station (real interchange point)
              const departureStation = {
                name: departure.name,
                location: departure.location,
                time: cumulativeTime,
                transitType: step.transit_details.line.vehicle.type,
                isRealInterchange: true
              };
              stations.push(departureStation);
              realInterchanges.push(departureStation);
              
              // Add intermediate stops only if needed for fairness
              const stepDuration = step.duration.value;
              const estimatedStops = Math.floor(stepDuration / 120); // Assume 2-minute average between stops
              
              if (estimatedStops > 1) {
                for (let i = 1; i < estimatedStops; i++) {
                  const interpolatedTime = cumulativeTime + (stepDuration * i / estimatedStops);
                  const interpolatedLat = departure.location.lat + 
                    (arrival.location.lat - departure.location.lat) * (i / estimatedStops);
                  const interpolatedLng = departure.location.lng + 
                    (arrival.location.lng - departure.location.lng) * (i / estimatedStops);
                  
                  stations.push({
                    name: `${departure.name} → ${arrival.name} (Stop ${i})`,
                    location: { lat: interpolatedLat, lng: interpolatedLng },
                    time: interpolatedTime,
                    transitType: step.transit_details.line.vehicle.type,
                    isInterpolated: true
                  });
                }
              }
              
              // Add arrival station (real interchange point)
              const arrivalStation = {
                name: arrival.name,
                location: arrival.location,
                time: cumulativeTime + step.duration.value,
                transitType: step.transit_details.line.vehicle.type,
                isRealInterchange: true
              };
              stations.push(arrivalStation);
              realInterchanges.push(arrivalStation);
            }
            cumulativeTime += step.duration.value;
          }
        }
        
        const totalDuration = legs.reduce((sum, leg) => sum + leg.duration.value, 0);
        const targetTime = totalDuration / 2;
        
        // PRIORITIZE REAL INTERCHANGE STATIONS FIRST
        let bestRealStation = null;
        
        const realCandidates = realInterchanges.filter(station => {
          const timeDiff = Math.abs(station.time - targetTime);
          return timeDiff <= 1800; // Within 30 minutes of midpoint (generous for real stations)
        });
        
        for (const station of realCandidates) {
          const timeFromMidpoint = Math.abs(station.time - targetTime);
          
          // Quick fairness check - is this station "fair enough"?
          const fairnessThreshold = totalDuration * 0.15; // 15% of total journey time
          if (timeFromMidpoint <= fairnessThreshold) {
            // Test venue density for this fair station
            try {
              const venueCount = await testVenueCountNearStation(station.location.lat, station.location.lng);
              if (venueCount >= 5) {
                bestRealStation = station;
                break; // Found a fair real station with good venues
              }
            } catch (error) {
              console.warn(`Could not check venues for ${station.name}`);
            }
            
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }
        
        // If we found a fair real station with venues, use it
        if (bestRealStation) {
          return {
            lat: bestRealStation.location.lat,
            lng: bestRealStation.location.lng,
            stationName: bestRealStation.name,
            isTransitOptimized: true,
            transitStations: stations,
            selectedOptimalStation: bestRealStation, // Pass the selected station for venue search
            totalTravelTime: totalDuration / 60
          };
        }
        
        // If no fair real station found, fall back to ALL stations (including interpolated)
        
        // Find stations near the time midpoint (expand search window if needed)
        let candidateStations = stations.filter(station => {
          const timeDiff = Math.abs(station.time - targetTime);
          return timeDiff <= 600; // Within 10 minutes of midpoint
        });
        
        // If no stations found within 10 minutes, expand to 20 minutes
        if (candidateStations.length === 0) {
          candidateStations = stations.filter(station => {
            const timeDiff = Math.abs(station.time - targetTime);
            return timeDiff <= 1200; // Within 20 minutes of midpoint
          });
        }
        
        // If still no stations, take middle stations from the route
        if (candidateStations.length === 0 && stations.length > 0) {
          const middleIndex = Math.floor(stations.length / 2);
          candidateStations = stations.slice(Math.max(0, middleIndex - 2), middleIndex + 3);
        }
        
        if (candidateStations.length === 0) {
          console.warn(`No transit stations found in route. Total steps: ${legs.reduce((sum, leg) => sum + leg.steps.length, 0)}`);
          throw new Error('No suitable stations found - route may be mostly walking/driving');
        }
        
        // Score stations based on venue density (not name importance)
        let bestStation = null;
        let bestScore = -1;
        
        for (const station of candidateStations) {
          let score = 0;
          
          // Factor 1: Proximity to time midpoint (40%)
          const timeProximity = 1 - (Math.abs(station.time - targetTime) / 1200);
          score += timeProximity * 40;
          
          // Factor 2: Transit type preference (20%)
          const transitScore = getTransitTypeScore(station.transitType);
          score += transitScore * 20;
          
          // Factor 3: Venue density (40%) - This is the key factor
          try {
            const venueCount = await testVenueCountNearStation(station.location.lat, station.location.lng);
            const venueScore = Math.min(1, venueCount / 8); // Scale 0-8 venues to 0-1 score
            score += venueScore * 40;
          } catch (error) {
            console.warn(`Could not get venue count for ${station.name}:`, error);
            score += 20; // Default venue score if API fails
          }
          
          if (score > bestScore) {
            bestScore = score;
            bestStation = station;
          }
          
          // Small delay to avoid API rate limits
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        if (bestStation) {
          return {
            lat: bestStation.location.lat,
            lng: bestStation.location.lng,
            stationName: bestStation.name,
            isTransitOptimized: true,
            transitStations: stations, // Pass all stations for venue search
            totalTravelTime: totalDuration / 60
          };
        }
        
        throw new Error('Could not select optimal station');
        
      } else {
        throw new Error(`Transit directions failed: ${data.status}`);
      }
    } catch (error) {
      console.warn('Transit midpoint calculation failed:', error);
      return null;
    }
  };

  // Score transit types by preference (for station importance calculation)
  const getTransitTypeScore = (transitType) => {
    switch (transitType?.toLowerCase()) {
      case 'subway':
      case 'heavy_rail': return 1.0;
      case 'rail': return 0.8;
      case 'bus': return 0.6;
      default: return 0.7;
    }
  };

  // Test venue count near a station (for station selection logic)
  const testVenueCountNearStation = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://meetup-backend-xqtj.onrender.com/api/places?lat=${lat}&lng=${lng}&radius=1000&type=restaurant`
      );
      const data = await response.json();
      
      if (data.status === 'OK') {
        const goodVenues = data.results.filter(place => place.rating && place.rating >= 3.5);
        return goodVenues.length;
      }
      
      return 0;
    } catch (error) {
      console.warn('Error getting venue count:', error);
      return 0;
    }
  };

  // Detect if user is on mobile device
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           ('ontouchstart' in window) ||
           (navigator.maxTouchPoints > 0);
  };

  // Calculate total travel time from all friends to a candidate point
  const calculateTotalTravelTimeToPoint = async (friendCoords, candidatePoint, transportMode, departureTime) => {
    const googleMode = transportMode === 'driving' ? 'driving' : 
                      transportMode === 'walking' ? 'walking' : 
                      transportMode === 'bicycling' ? 'bicycling' : 'transit';
    
    const origins = friendCoords.map(coord => `${coord.lat},${coord.lng}`).join('|');
    const destination = `${candidatePoint.lat},${candidatePoint.lng}`;
    
    let url = `https://meetup-backend-xqtj.onrender.com/api/distancematrix?origins=${encodeURIComponent(origins)}&destinations=${encodeURIComponent(destination)}&mode=${googleMode}&units=metric`;
    
    if (departureTime) {
      const timestamp = Math.floor(new Date(departureTime).getTime() / 1000);
      url += `&departure_time=${timestamp}`;
    }
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK') {
      let totalTime = 0;
      let validRoutes = 0;
      
      for (const row of data.rows) {
        const element = row.elements[0];
        if (element.status === 'OK') {
          totalTime += element.duration.value / 60; // Convert to minutes
          validRoutes++;
        }
      }
      
      // Only return if we have routes for all friends
      if (validRoutes === friendCoords.length) {
        return totalTime;
      } else {
        throw new Error('Could not calculate routes for all friends');
      }
    } else {
      throw new Error(`Distance Matrix failed: ${data.status}`);
    }
  };

  // Find optimal hub for 3+ friends by testing multiple potential meeting points
  const findOptimalHub = async (friendCoords, transportMode, departureTime) => {
    try {
      // Strategy: Test several candidate points and find the one that minimizes total travel time
      const candidates = [];
      
      // Candidate 1: Geographic center (fallback)
      const geoCenter = {
        lat: friendCoords.reduce((sum, coord) => sum + coord.lat, 0) / friendCoords.length,
        lng: friendCoords.reduce((sum, coord) => sum + coord.lng, 0) / friendCoords.length
      };
      candidates.push(geoCenter);
      
      // Candidates 2-N: Midpoints between each pair of friends
      for (let i = 0; i < friendCoords.length; i++) {
        for (let j = i + 1; j < friendCoords.length; j++) {
          const midpoint = await findRouteMidpoint(friendCoords[i], friendCoords[j], transportMode, departureTime);
          candidates.push({
            lat: midpoint.lat,
            lng: midpoint.lng
          });
        }
      }
      
      // Test each candidate by calculating total travel time from all friends
      let bestCandidate = geoCenter;
      let bestTotalTime = Infinity;
      
      for (const candidate of candidates) {
        try {
          const totalTime = await calculateTotalTravelTimeToPoint(friendCoords, candidate, transportMode, departureTime);
          
          if (totalTime < bestTotalTime) {
            bestTotalTime = totalTime;
            bestCandidate = candidate;
          }
        } catch (error) {
          console.warn('Failed to calculate travel time for candidate:', error);
        }
      }
      
      return {
        lat: bestCandidate.lat,
        lng: bestCandidate.lng,
        isRouteBased: true,
        totalTravelTime: bestTotalTime
      };
      
    } catch (error) {
      console.warn('Optimal hub calculation failed, using geographic center:', error);
      // Fallback to geographic center
      return {
        lat: friendCoords.reduce((sum, coord) => sum + coord.lat, 0) / friendCoords.length,
        lng: friendCoords.reduce((sum, coord) => sum + coord.lng, 0) / friendCoords.length,
        isRouteBased: false,
        totalTravelTime: null
      };
    }
  };

  // Route-based center finding with transit optimization
  const findOptimalMeetingPoint = async (friendCoords, transportMode, departureTime) => {
    if (friendCoords.length === 2) {
      // For 2 friends: use transit-specific logic for public transport
      if (transportMode === 'transit') {
        const transitResult = await findTransitMidpoint(friendCoords[0], friendCoords[1], transportMode, departureTime);
        if (transitResult) {
          return transitResult;
        }
        // Fallback to regular route midpoint if transit fails
      }
      
      // For other transport modes, find midpoint along actual route
      return await findRouteMidpoint(friendCoords[0], friendCoords[1], transportMode, departureTime);
    } else {
      // For 3+ friends: find point that minimizes total travel time
      return await findOptimalHub(friendCoords, transportMode, departureTime);
    }
  };

  // Find midpoint along actual route between two friends (non-transit)
  const findRouteMidpoint = async (friend1, friend2, transportMode, departureTime) => {
    try {
      const googleMode = transportMode === 'driving' ? 'driving' : 
                        transportMode === 'walking' ? 'walking' : 
                        transportMode === 'bicycling' ? 'bicycling' : 'transit';
      
      let url = `https://meetup-backend-xqtj.onrender.com/api/directions?origin=${friend1.lat},${friend1.lng}&destination=${friend2.lat},${friend2.lng}&mode=${googleMode}`;
      
      if (departureTime) {
        const timestamp = Math.floor(new Date(departureTime).getTime() / 1000);
        url += `&departure_time=${timestamp}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === 'OK' && data.routes.length > 0) {
        const route = data.routes[0];
        const legs = route.legs;
        
        // Calculate total duration across all legs
        const totalDuration = legs.reduce((sum, leg) => sum + leg.duration.value, 0);
        const halfDuration = totalDuration / 2;
        
        let accumulatedTime = 0;
        
        // Walk through legs (not individual steps) to find the right leg
        for (let legIndex = 0; legIndex < legs.length; legIndex++) {
          const leg = legs[legIndex];
          const legDuration = leg.duration.value;
          
          // Check if the midpoint falls within this leg
          if (accumulatedTime + legDuration >= halfDuration) {
            const timeIntoLeg = halfDuration - accumulatedTime;
            const progressThroughLeg = timeIntoLeg / legDuration;
            
            // Linear interpolation between start and end of this leg
            const startLat = leg.start_location.lat;
            const startLng = leg.start_location.lng;
            const endLat = leg.end_location.lat;
            const endLng = leg.end_location.lng;
            
            const midpointLat = startLat + (endLat - startLat) * progressThroughLeg;
            const midpointLng = startLng + (endLng - startLng) * progressThroughLeg;
            
            return {
              lat: midpointLat,
              lng: midpointLng,
              isRouteBased: true,
              totalTravelTime: totalDuration / 60 // minutes
            };
          }
          
          accumulatedTime += legDuration;
        }
        
        // Fallback to geographic midpoint of route endpoints
        console.warn('Could not find midpoint within route legs, using geographic center');
        return {
          lat: (friend1.lat + friend2.lat) / 2,
          lng: (friend1.lng + friend2.lng) / 2,
          isRouteBased: false,
          totalTravelTime: totalDuration / 60
        };
        
      } else {
        throw new Error(`Directions API failed: ${data.status}`);
      }
    } catch (error) {
      console.warn('Route midpoint calculation failed, using geographic center:', error);
      // Fallback to geographic midpoint
      return {
        lat: (friend1