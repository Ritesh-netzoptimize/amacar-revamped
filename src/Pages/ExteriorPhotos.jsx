import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  ChevronRight,
  ChevronLeft,
  X
} from 'lucide-react';
import Header from '@/components/Header/Header';
import { useNavigate } from 'react-router-dom';

export default function ExteriorPhotos() {
  const navigate = useNavigate();
  
  // Mock data and handlers for standalone usage
  const data = { exteriorPhotos: [], interiorPhotos: [] };
  const onChange = (newData) => {
    console.log('Photos updated:', newData);
  };
  const onNext = () => {
    navigate('/review');
  };
  const onPrev = () => {
    navigate('/auction-page');
  };
    const [currentStep, setCurrentStep] = useState('exterior'); // 'exterior' or 'interior'
    const [exteriorPhotos, setExteriorPhotos] = useState(data.exteriorPhotos || []);
    const [interiorPhotos, setInteriorPhotos] = useState(data.interiorPhotos || []);
    const [dragActive, setDragActive] = useState(false);
    const [uploadingMap, setUploadingMap] = useState({}); // { [requirementId]: true }
    const [progressMap, setProgressMap] = useState({}); // { [requirementId]: 0-100 }
  
    const exteriorRequirements = [
      { id: 'front', label: 'Front View', icon: '🚗', description: 'Full front view of the vehicle' },
      { id: 'rear', label: 'Rear View', icon: '🚙', description: 'Full rear view of the vehicle' },
      { id: 'side_driver', label: 'Driver Side', icon: '🚘', description: 'Complete driver side profile' },
      { id: 'side_passenger', label: 'Passenger Side', icon: '🚘', description: 'Complete passenger side profile' },
      { id: 'front_angle', label: 'Front Angle', icon: '📐', description: '3/4 front angle view' },
      { id: 'rear_angle', label: 'Rear Angle', icon: '📐', description: '3/4 rear angle view' },
      { id: 'wheels', label: 'Wheels & Tires', icon: '🛞', description: 'Close-up of wheels and tires' },
    ];
  
    const interiorRequirements = [
      { id: 'dashboard', label: 'Dashboard', icon: '📊', description: 'Front dashboard and controls' },
      { id: 'odometer', label: 'Odometer', icon: '🔢', description: 'Mileage reading clearly visible' },
      { id: 'front_seats', label: 'Front Seats', icon: '🪑', description: 'Front seats condition' },
      { id: 'rear_seats', label: 'Rear Seats', icon: '🪑', description: 'Rear seats condition' },
    ];
  
    const currentRequirements = currentStep === 'exterior' ? exteriorRequirements : interiorRequirements;
    const currentPhotos = currentStep === 'exterior' ? exteriorPhotos : interiorPhotos;
    const totalRequired = currentRequirements.length;
    const uploadedCount = currentPhotos.length;
    const isCurrentStepComplete = uploadedCount >= totalRequired;
  
    const handleSinglePhotoUpload = async (file, requirementId) => {
      setUploadingMap(prev => ({ ...prev, [requirementId]: true }));
      setProgressMap(prev => ({ ...prev, [requirementId]: 0 }));

      // Simulate upload progress independently per requirement
      for (let progress = 0; progress <= 100; progress += 20) {
        setProgressMap(prev => ({ ...prev, [requirementId]: progress }));
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const newPhoto = {
        id: `${currentStep}_photo_${Date.now()}`,
        file,
        url: URL.createObjectURL(file),
        type: currentStep,
        requirement: requirementId,
        timestamp: new Date(),
      };
      
      if (currentStep === 'exterior') {
        setExteriorPhotos(prev => [...prev, newPhoto]);
      } else {
        setInteriorPhotos(prev => [...prev, newPhoto]);
      }

      setUploadingMap(prev => {
        const next = { ...prev };
        delete next[requirementId];
        return next;
      });
      setProgressMap(prev => {
        const next = { ...prev };
        delete next[requirementId];
        return next;
      });
    };
  
    const handleFileUpload = async (files) => {
      // Compute starting index so multiple files map to distinct requirement slots
      const startCount = currentStep === 'exterior' ? exteriorPhotos.length : interiorPhotos.length;
      const tasks = Array.from(files).map((file, i) => {
        const idx = Math.min(startCount + i, currentRequirements.length - 1);
        const requirement = currentRequirements[idx];
        const requirementId = requirement?.id;
        return requirementId ? handleSinglePhotoUpload(file, requirementId) : Promise.resolve();
      });
      await Promise.all(tasks);
    };
  
    const handleDrop = (e) => {
      e.preventDefault();
      setDragActive(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files);
      }
    };
  
    const handleDragOver = (e) => {
      e.preventDefault();
      setDragActive(true);
    };
  
    const handleDragLeave = (e) => {
      e.preventDefault();
      setDragActive(false);
    };
  
    const removePhoto = (photoId) => {
      if (currentStep === 'exterior') {
        setExteriorPhotos(prev => prev.filter(photo => photo.id !== photoId));
      } else {
        setInteriorPhotos(prev => prev.filter(photo => photo.id !== photoId));
      }
    };
  
    const handleNextStep = () => {
      if (currentStep === 'exterior') {
        setCurrentStep('interior');
      } else {
        // Save all photos and proceed
        onChange({ 
          exteriorPhotos, 
          interiorPhotos, 
          photos: [...exteriorPhotos, ...interiorPhotos] 
        });
        onNext();
      }
    };
  
    const handlePrevStep = () => {
      if (currentStep === 'interior') {
        setCurrentStep('exterior');
      } else {
        onPrev();
      }
    };
  
    const progress = Math.round((uploadedCount / totalRequired) * 100);
  
    return (
      <>
        <Header />
        <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 pt-20 md:pt-24">
          <div className="mx-auto max-w-7xl px-6 py-12">
            <div className="max-w-4xl mx-auto">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
              currentStep === 'exterior' ? 'bg-[#f6851f] text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                {exteriorPhotos.length >= exteriorRequirements.length ? '✓' : '1'}
              </div>
              <span className="font-semibold">Exterior Photos</span>
            </div>
            
            <div className={`w-8 h-0.5 ${
              currentStep === 'interior' ? 'bg-[#f6851f]' : 'bg-slate-300'
            }`} />
            
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
              currentStep === 'interior' ? 'bg-[#f6851f] text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                {interiorPhotos.length >= interiorRequirements.length ? '✓' : '2'}
              </div>
              <span className="font-semibold">Interior Photos</span>
            </div>
          </div>
  
          {/* Progress Bar */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold text-slate-700">
              {currentStep === 'exterior' ? 'Exterior' : 'Interior'} Photos: {uploadedCount} of {totalRequired}
            </span>
            <span className="text-lg font-semibold text-[#f6851f]">
              {progress}% Complete
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-[#f6851f] to-[#e63946] h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          
        </div>
  
        {/* Current Step Header */}
        <div className="text-center mb-8">
          <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
            currentStep === 'exterior' ? 'bg-blue-100' : 'bg-green-100'
          }`}>
            <span className="text-4xl">
              {currentStep === 'exterior' ? '🚗' : '🪑'}
            </span>
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            {currentStep === 'exterior' ? 'Exterior Photos' : 'Interior Photos'}
          </h2>
          <p className="text-lg text-slate-600">
            {currentStep === 'exterior' 
              ? 'Upload 7 photos showing the exterior of your vehicle' 
              : 'Upload 4 photos showing the interior of your vehicle'
            }
          </p>
        </div>
  
  
        {/* Photo Requirements with Click-to-Upload */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">
            Required {currentStep} Photos - Click to Upload
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentRequirements.map((photo, index) => {
              const uploadedPhoto = currentPhotos.find(p => p.requirement === photo.id);
              const hasPhoto = !!uploadedPhoto;
              const isUploadingThisPhoto = !!uploadingMap[photo.id];
              
              return (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative rounded-xl overflow-hidden transition-all duration-300 cursor-pointer ${
                    hasPhoto
                      ? 'bg-green-50 border-2 border-green-200'
                      : isUploadingThisPhoto
                      ? 'bg-orange-50 border-2 border-orange-400'
                      : 'bg-slate-50 border-2 border-slate-200 hover:border-orange-400 hover:bg-orange-50'
                  }`}
                  onClick={() => {
                    if (!hasPhoto && !uploadingMap[photo.id]) {
                      document.getElementById(`photo-upload-${photo.id}`).click();
                    }
                  }}
                >
                  {isUploadingThisPhoto ? (
                    /* Uploading State */
                    <div className="aspect-square flex flex-col items-center justify-center p-4 text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mb-4"
                      />
                      <p className="text-sm font-medium text-orange-700 mb-2">
                        Uploading...
                      </p>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <motion.div
                          className="bg-orange-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progressMap[photo.id] || 0}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <p className="text-xs text-orange-600 mt-2">
                        {(progressMap[photo.id] || 0)}% complete
                      </p>
                    </div>
                  ) : hasPhoto ? (
                    /* Photo Preview */
                    <div className="relative group">
                      <div className="aspect-square">
                        <img
                          src={uploadedPhoto.url}
                          alt={photo.label}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Overlay with photo info */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removePhoto(uploadedPhoto.id);
                          }}
                          className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Photo label overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <div className="flex items-center space-x-2 text-white">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-sm font-medium">{photo.label}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Clickable Placeholder for missing photo */
                    <div className="aspect-square flex flex-col items-center justify-center p-4 text-center group">
                      <div className="text-4xl mb-3 opacity-50 group-hover:opacity-75 transition-opacity">
                        {photo.icon}
                      </div>
                      <p className="text-sm font-medium text-slate-700 mb-1">
                        {photo.label}
                      </p>
                      <p className="text-xs text-slate-500 mb-3">
                        {photo.description}
                      </p>
                      <div className="w-8 h-8 rounded-full border-2 border-dashed border-slate-300 group-hover:border-orange-400 group-hover:bg-orange-50 flex items-center justify-center transition-colors">
                        <span className="text-slate-400 group-hover:text-orange-500 text-lg">+</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-2 group-hover:text-orange-500">
                        Click to upload
                      </p>
                    </div>
                  )}
                  
                  {/* Hidden file input for this specific photo */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleSinglePhotoUpload(e.target.files[0], photo.id);
                      }
                    }}
                    className="hidden"
                    id={`photo-upload-${photo.id}`}
                    disabled={!!uploadingMap[photo.id]}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
  
        {/* Tips */}
        <div className={`rounded-xl p-6 mb-8 ${
          currentStep === 'exterior' ? 'bg-blue-50' : 'bg-green-50'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${
            currentStep === 'exterior' ? 'text-blue-700' : 'text-green-700'
          }`}>
            📸 {currentStep === 'exterior' ? 'Exterior' : 'Interior'} Photo Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {currentStep === 'exterior' ? (
              <>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                  <span className="text-blue-600">Take photos in good lighting (outdoor preferred)</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                  <span className="text-blue-600">Clean your vehicle before taking photos</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                  <span className="text-blue-600">Include all angles and important details</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                  <span className="text-blue-600">Show wheels, lights, and body condition clearly</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                  <span className="text-green-600">Ensure good interior lighting</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                  <span className="text-green-600">Clean interior before photographing</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                  <span className="text-green-600">Make sure odometer reading is clearly visible</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                  <span className="text-green-600">Show seat condition and dashboard details</span>
                </div>
              </>
            )}
          </div>
        </div>
  
        {/* Action Buttons */}
        <div className="flex justify-between">
          <motion.button
            onClick={handlePrevStep}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:scale-[1.01]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ChevronLeft className="w-4 h-4" />
            {currentStep === 'exterior' ? 'Back to Preferences' : 'Back to Exterior'}
          </motion.button>
          
          <motion.button
            onClick={handleNextStep}
            disabled={!isCurrentStepComplete}
            className={`inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-[#f6851f] to-[#e63946] px-6 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:scale-[1.01] ${
              !isCurrentStepComplete ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            whileHover={isCurrentStepComplete ? { scale: 1.02 } : {}}
            whileTap={isCurrentStepComplete ? { scale: 0.98 } : {}}
          >
            {currentStep === 'exterior' ? 'Continue to Interior' : 'Continue to Review'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </motion.button>
        </div>
            </div>
          </div>
        </div>
      </>
    );
}