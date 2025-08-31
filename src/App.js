import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Clock, AlertTriangle, Phone, Star, Navigation, Mic, MicOff, Send, Bot, User, Activity } from 'lucide-react';
import { db, initializeDoctors } from './firebase';
import Map from './components/Map';

// Initialize sample doctors data
initializeDoctors();

// Symptom to specialist mapping database
const symptomSpecialistMapping = {
  'chest pain': { specialist: 'Cardiologist', urgency: 'urgent', icon: '❤️' },
  'heart pain': { specialist: 'Cardiologist', urgency: 'urgent', icon: '❤️' },
  'shortness of breath': { specialist: 'Cardiologist', urgency: 'urgent', icon: '❤️' },
  'palpitations': { specialist: 'Cardiologist', urgency: 'routine', icon: '❤️' },
  'headache': { specialist: 'Neurologist', urgency: 'routine', icon: '🧠' },
  'migraine': { specialist: 'Neurologist', urgency: 'routine', icon: '🧠' },
  'seizure': { specialist: 'Neurologist', urgency: 'emergency', icon: '🧠' },
  'stroke': { specialist: 'Neurologist', urgency: 'emergency', icon: '🧠' },
  'skin rash': { specialist: 'Dermatologist', urgency: 'routine', icon: '👨‍⚕️' },
  'acne': { specialist: 'Dermatologist', urgency: 'routine', icon: '👨‍⚕️' },
  'eczema': { specialist: 'Dermatologist', urgency: 'routine', icon: '👨‍⚕️' },
  'broken bone': { specialist: 'Orthopedist', urgency: 'urgent', icon: '🦴' },
  'joint pain': { specialist: 'Orthopedist', urgency: 'routine', icon: '🦴' },
  'back pain': { specialist: 'Orthopedist', urgency: 'routine', icon: '🦴' },
  'cough': { specialist: 'Pulmonologist', urgency: 'routine', icon: '🫁' },
  'asthma': { specialist: 'Pulmonologist', urgency: 'urgent', icon: '🫁' },
  'breathing problems': { specialist: 'Pulmonologist', urgency: 'urgent', icon: '🫁' },
  'stomach pain': { specialist: 'Gastroenterologist', urgency: 'routine', icon: '🏥' },
  'nausea': { specialist: 'Gastroenterologist', urgency: 'routine', icon: '🏥' },
  'diarrhea': { specialist: 'Gastroenterologist', urgency: 'routine', icon: '🏥' },
  'eye pain': { specialist: 'Ophthalmologist', urgency: 'urgent', icon: '👁️' },
  'vision problems': { specialist: 'Ophthalmologist', urgency: 'urgent', icon: '👁️' },
  'ear pain': { specialist: 'ENT Specialist', urgency: 'routine', icon: '👂' },
  'hearing loss': { specialist: 'ENT Specialist', urgency: 'routine', icon: '👂' },
  'throat pain': { specialist: 'ENT Specialist', urgency: 'routine', icon: '👂' },
  'fever': { specialist: 'General Physician', urgency: 'routine', icon: '🌡️' },
  'cold': { specialist: 'General Physician', urgency: 'routine', icon: '🌡️' },
  'flu': { specialist: 'General Physician', urgency: 'routine', icon: '🌡️' },
  'diabetes': { specialist: 'Endocrinologist', urgency: 'routine', icon: '💉' },
  'thyroid': { specialist: 'Endocrinologist', urgency: 'routine', icon: '💉' },
  'kidney pain': { specialist: 'Nephrologist', urgency: 'urgent', icon: '🏥' },
  'blood in urine': { specialist: 'Nephrologist', urgency: 'urgent', icon: '🏥' },
  'depression': { specialist: 'Psychiatrist', urgency: 'routine', icon: '🧠' },
  'anxiety': { specialist: 'Psychiatrist', urgency: 'routine', icon: '🧠' },
  'pregnancy': { specialist: 'Gynecologist', urgency: 'routine', icon: '👶' },
  'menstrual problems': { specialist: 'Gynecologist', urgency: 'routine', icon: '👶' }
};

// Mock doctors data
const mockDoctors = [
  { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Cardiologist', rating: 4.8, distance: '0.5 km', phone: '+1234567890', lat: 37.7749, lng: -122.4194 },
  { id: 2, name: 'Dr. Michael Chen', specialty: 'Neurologist', rating: 4.9, distance: '1.2 km', phone: '+1234567891', lat: 37.7849, lng: -122.4094 },
  { id: 3, name: 'Dr. Emily Davis', specialty: 'Dermatologist', rating: 4.7, distance: '2.1 km', phone: '+1234567892', lat: 37.7649, lng: -122.4294 },
  { id: 4, name: 'Dr. Robert Wilson', specialty: 'Orthopedist', rating: 4.6, distance: '1.8 km', phone: '+1234567893', lat: 37.7949, lng: -122.3994 },
  { id: 5, name: 'Dr. Lisa Thompson', specialty: 'Pulmonologist', rating: 4.8, distance: '2.5 km', phone: '+1234567894', lat: 37.7549, lng: -122.4394 },
  { id: 6, name: 'Dr. James Brown', specialty: 'Gastroenterologist', rating: 4.7, distance: '1.9 km', phone: '+1234567895', lat: 37.7649, lng: -122.4094 },
  { id: 7, name: 'Dr. Maria Garcia', specialty: 'Ophthalmologist', rating: 4.9, distance: '1.1 km', phone: '+1234567896', lat: 37.7749, lng: -122.4094 },
  { id: 8, name: 'Dr. David Lee', specialty: 'ENT Specialist', rating: 4.6, distance: '2.3 km', phone: '+1234567897', lat: 37.7849, lng: -122.4294 },
  { id: 9, name: 'Dr. Jennifer White', specialty: 'General Physician', rating: 4.8, distance: '0.8 km', phone: '+1234567898', lat: 37.7549, lng: -122.4194 },
  { id: 10, name: 'Dr. Richard Taylor', specialty: 'Endocrinologist', rating: 4.7, distance: '1.5 km', phone: '+1234567899', lat: 37.7749, lng: -122.3994 }
];

const App = () => {
  const [symptoms, setSymptoms] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [nearbyDoctors, setNearbyDoctors] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [activeTab, setActiveTab] = useState('chat');
  const [loading, setLoading] = useState(false);
  
  const recognitionRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSymptoms(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.log('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
  }, []);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied');
          setUserLocation({ lat: 37.7749, lng: -122.4194 }); // Default to SF
        }
      );
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert('Speech recognition not supported in this browser. Please use Chrome.');
      }
    }
  };

  const analyzeSymptoms = (symptomText) => {
    const normalizedSymptoms = symptomText.toLowerCase();
    let bestMatch = null;
    let highestScore = 0;

    // Simple keyword matching algorithm
    for (const [symptom, data] of Object.entries(symptomSpecialistMapping)) {
      const keywords = symptom.split(' ');
      let score = 0;
      
      keywords.forEach(keyword => {
        if (normalizedSymptoms.includes(keyword)) {
          score += 1;
        }
      });

      if (score > highestScore) {
        highestScore = score;
        bestMatch = { symptom, ...data };
      }
    }

    // Default to general physician if no match
    if (!bestMatch || highestScore === 0) {
      bestMatch = {
        symptom: 'general consultation',
        specialist: 'General Physician',
        urgency: 'routine',
        icon: '👨‍⚕️'
      };
    }

    return bestMatch;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!symptoms.trim()) return;

    setLoading(true);
    
    // Add user message to chat
    const userMessage = { type: 'user', content: symptoms };
    setChatMessages(prev => [...prev, userMessage]);

    // Analyze symptoms
    const analysisResult = analyzeSymptoms(symptoms);
    setAnalysis(analysisResult);

    // Filter doctors by specialty
    const relevantDoctors = mockDoctors.filter(
      doctor => doctor.specialty === analysisResult.specialist
    );
    setNearbyDoctors(relevantDoctors);

    // Add AI response to chat
    const aiResponse = {
      type: 'ai',
      content: `Based on your symptoms "${symptoms}", I recommend consulting a **${analysisResult.specialist}**. This appears to be **${analysisResult.urgency}** priority. I've found ${relevantDoctors.length} nearby specialists for you.`
    };
    
    setTimeout(() => {
      setChatMessages(prev => [...prev, aiResponse]);
      setLoading(false);
      setActiveTab('results');
    }, 1000);

    setSymptoms('');
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'emergency': return 'text-red-600 bg-red-50';
      case 'urgent': return 'text-orange-600 bg-orange-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  const getUrgencyIcon = (urgency) => {
    switch (urgency) {
      case 'emergency': return <AlertTriangle className="w-4 h-4" />;
      case 'urgent': return <Clock className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-blue-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MediGuide AI
              </h1>
              <p className="text-gray-600 text-sm">Your AI-powered healthcare assistant</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'chat'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            💬 Symptom Chat
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'results'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            📋 Analysis & Doctors
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'map'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            🗺️ Map View
          </button>
        </div>

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="space-y-6">
            {/* Chat Messages */}
            <div className="bg-white rounded-xl shadow-lg p-6 max-h-96 overflow-y-auto">
              {chatMessages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Bot className="w-16 h-16 mx-auto mb-4 text-blue-300" />
                  <p className="text-lg mb-2">Hello! I'm your AI medical assistant.</p>
                  <p className="text-sm">Tell me about your symptoms and I'll help you find the right specialist.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatMessages.map((message, index) => (
                    <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <div className="flex items-start space-x-2">
                          {message.type === 'ai' && <Bot className="w-5 h-5 mt-0.5 text-blue-500" />}
                          {message.type === 'user' && <User className="w-5 h-5 mt-0.5" />}
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg px-4 py-2">
                        <div className="flex items-center space-x-2">
                          <Bot className="w-5 h-5 text-blue-500" />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Input Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Describe your symptoms... (e.g., chest pain, headache, fever)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows="3"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      isListening
                        ? 'bg-red-500 border-red-500 text-white animate-pulse'
                        : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!symptoms.trim() || loading}
                    className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Click the microphone to speak your symptoms or type them above. Press Enter to send.
              </p>
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            {analysis ? (
              <>
                {/* Analysis Card */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold mb-4">🔍 Symptom Analysis</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{analysis.icon}</span>
                        <div>
                          <p className="font-semibold">Recommended Specialist</p>
                          <p className="text-blue-600 font-bold">{analysis.specialist}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        {getUrgencyIcon(analysis.urgency)}
                        <div>
                          <p className="font-semibold">Priority Level</p>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(analysis.urgency)}`}>
                            {analysis.urgency.charAt(0).toUpperCase() + analysis.urgency.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nearby Doctors */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold mb-4">👩‍⚕️ Nearby {analysis.specialist}s</h2>
                  <div className="space-y-4">
                    {nearbyDoctors.map((doctor) => (
                      <div key={doctor.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg">{doctor.name}</h3>
                            <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span>{doctor.rating}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Navigation className="w-4 h-4" />
                                <span>{doctor.distance}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => window.open(`tel:${doctor.phone}`, '_self')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            >
                              <Phone className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                              <MapPin className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No analysis yet. Please describe your symptoms first.</p>
              </div>
            )}
          </div>
        )}

        {/* Map Tab */}
          {activeTab === 'map' && (
            <Map 
              specialty={analysis?.specialist} 
              userLocation={userLocation} 
              isEmergency={analysis?.urgency === 'emergency'} 
            />
          )}
      </div>

      {/* Emergency Banner */}
      {analysis?.urgency === 'emergency' && (
        <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto bg-red-500 text-white p-4 rounded-lg shadow-lg animate-pulse z-50">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6" />
            <div>
              <p className="font-bold">🚨 Emergency Situation Detected</p>
              <p className="text-sm">Please call emergency services immediately: 911</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions Floating Button */}
     
      <div className="fixed bottom-6 right-6 z-40">
       <button 
         onClick={() => setActiveTab('chat')}
         className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-colors"
       >
         <Bot className="w-6 h-6" />
       </button>
     </div>
   </div>
 );
};

export default App;