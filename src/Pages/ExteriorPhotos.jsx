import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function VehiclePhotos() {
  const navigate = useNavigate();
  const questions = useSelector((state) => state?.carDetailsAndQuestions?.questions);

  // Mock data and handlers for standalone usage
  const data = { photos: [] };
  const [productId, setProductId] = useState(null);
  const location = useLocation();
  const onChange = (newData) => {
    // console.log('Photos updated:', newData);
  };
  const onNext = () => {
    navigate('/review');
  };
  const onPrev = () => {
    navigate('/auction-page');
  };

  useEffect(() => {
    // console.log("questions", questions);
  });

  // Check if accident is Minor or Major
  const hasAccident = questions.some(
    (q) => q.key === 'accident' && (q.answer === 'Minor' || q.answer === 'Major')
  );

  const [photos, setPhotos] = useState(data.photos || []);
  const [accidentPhotos, setAccidentPhotos] = useState([]);
  const [uploadingMap, setUploadingMap] = useState({});
  const [progressMap, setProgressMap] = useState({});
  const [dragActive, setDragActive] = useState(false);

  const photoRequirements = [
    { 
      id: 'front', 
      label: 'Front View', 
      icon: '🚗', 
      description: 'Full front view of the vehicle', 
      required: true,
      tip: 'Take the photo in daylight with the whole front clearly visible.'
    },
    { 
      id: 'rear', 
      label: 'Rear View', 
      icon: '🚙', 
      description: 'Full rear view of the vehicle', 
      required: true,
      tip: 'Ensure the entire rear is visible and avoid dark shadows.'
    },
    { 
      id: 'side_driver', 
      label: 'Driver Side', 
      icon: '🚘', 
      description: 'Complete driver side profile', 
      required: true,
      tip: 'Stand far enough so the whole side fits clearly in the frame.'
    },
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: '📊', 
      description: 'Front dashboard and controls', 
      required: true,
      tip: 'Switch on ignition so dashboard details are clearly lit.'
    },
    { 
      id: 'side_passenger', 
      label: 'Passenger Side', 
      icon: '🚘', 
      description: 'Complete passenger side profile', 
      required: false,
      tip: 'Capture the full side without cutting off wheels or mirrors.'
    },
    { 
      id: 'odometer', 
      label: 'Odometer', 
      icon: '🔢', 
      description: 'Mileage reading clearly visible', 
      required: false,
      tip: 'Focus closely so the numbers are sharp and readable.'
    },
    { 
      id: 'wheels', 
      label: 'Wheels & Tires', 
      icon: '🛞', 
      description: 'Close-up of wheels and tires', 
      required: false,
      tip: 'Make sure tread patterns and rims are in clear focus.'
    },
    { 
      id: 'front_seats', 
      label: 'Front Seats', 
      icon: '🪑', 
      description: 'Front seats condition', 
      required: false,
      tip: 'Adjust lighting to avoid shadows on seat fabric.'
    },
    
  ];

  // Initialize one mandatory accident photo card if hasAccident is true
  useEffect(() => {
    if (hasAccident && accidentPhotos.length === 0) {
      setAccidentPhotos([{
        id: `accident_mandatory_${Date.now()}`,
        label: 'Accident Photo (Required)',
        icon: '📸',
        description: 'Photo of accident damage',
        required: true,
        isAccident: true
      }]);
    }
  }, [hasAccident]);

  const requiredPhotos = photoRequirements.filter((req) => req.required);
  const totalRequired = requiredPhotos.length + (hasAccident ? 1 : 0); // Include mandatory accident photo
  const uploadedRequiredCount = photos.filter((photo) => 
    requiredPhotos.some((req) => req.id === photo.requirement)
  ).length + (hasAccident && accidentPhotos.some(p => p.requirement?.startsWith('accident_mandatory_')) ? 1 : 0);
  const isComplete = uploadedRequiredCount >= totalRequired;

  const handleSinglePhotoUpload = async (file, id) => {
    setUploadingMap((prev) => ({ ...prev, [id]: true }));
    setProgressMap((prev) => ({ ...prev, [id]: 0 }));

    for (let progress = 0; progress <= 100; progress += 20) {
      setProgressMap((prev) => ({ ...prev, [id]: progress }));
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const newPhoto = {
      id: `${id}_${Date.now()}`,
      file,
      url: URL.createObjectURL(file),
      requirement: id,
      timestamp: new Date(),
    };

    if (id.startsWith('accident_')) {
      setAccidentPhotos((prev) => {
        const updatedPhotos = prev.map(p => 
          p.id === id ? { ...p, ...newPhoto } : p
        );
        return updatedPhotos;
      });
    } else {
      setPhotos((prev) => [...prev, newPhoto]);
    }

    setUploadingMap((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setProgressMap((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleFileUpload = async (files, requirementId) => {
    const tasks = Array.from(files).map((file) => handleSinglePhotoUpload(file, requirementId));
    await Promise.all(tasks);
  };

  const handleDrop = (e, requirementId) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files, requirementId);
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

  const removePhoto = (photoId, isAccidentPhoto = false) => {
    if (isAccidentPhoto) {
      setAccidentPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
    } else {
      setPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
    }
  };

  const addAccidentPhotoCard = () => {
    const newId = `accident_${Date.now()}`;
    setAccidentPhotos((prev) => [
      ...prev,
      { id: newId, label: 'Accident Photo', icon: '📸', description: 'Photo of accident damage', required: false, isAccident: true },
    ]);
  };

  useEffect(() => {
    onChange({ photos: [...photos, ...accidentPhotos.filter(p => p.file)] });
  }, [photos, accidentPhotos]);

  const progress = Math.round((uploadedRequiredCount / totalRequired) * 100);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 pt-24 md:pt-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-slate-900 text-center mb-10 font-sans tracking-tight"
        >
          Upload Your Vehicle Photos
        </motion.h1>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="border-2 border-[#f6851f]/20 rounded-2xl p-6 mb-10 bg-white/90 shadow-lg backdrop-blur-md"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold text-slate-800">
              Required Photos: {uploadedRequiredCount} of {totalRequired}
            </span>
            <span className="text-lg font-semibold text-[#f6851f]">
              {progress}% Complete
            </span>
          </div>
          <div className="w-full bg-slate-200/50 rounded-full h-4">
            <motion.div
              className="bg-gradient-to-r from-[#f6851f] to-[#e63946] h-4 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Photo Requirements Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold text-slate-800 mb-6 font-sans">Required & Optional Photos</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {photoRequirements.map((photo, index) => {
              const uploadedPhoto = photos.find((p) => p.requirement === photo.id);
              const hasPhoto = !!uploadedPhoto;
              const isUploadingThisPhoto = !!uploadingMap[photo.id];

              return (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className={`relative rounded-2xl overflow-hidden shadow-md backdrop-blur-sm bg-white/80 transition-all duration-300 ${
                    photo.required
                      ? hasPhoto
                        ? 'border-2 border-green-300/50 bg-green-50/50'
                        : 'border-2 border-[#f6851f]/30'
                      : hasPhoto
                      ? 'border-2 border-green-300/50 bg-green-50/50'
                      : 'border-2 border-slate-200/50 opacity-90'
                  } hover:border-[#f6851f]/50 hover:shadow-lg hover:bg-orange-50/30`}
                >
                  {isUploadingThisPhoto ? (
                    <div className="aspect-square flex flex-col items-center justify-center p-5 text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-10 h-10 border-4 border-[#f6851f] border-t-transparent rounded-full mb-4"
                      />
                      <p className="text-sm font-medium text-slate-800">Uploading...</p>
                      <div className="w-full bg-slate-200/50 rounded-full h-2 mt-3">
                        <motion.div
                          className="bg-[#f6851f] h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progressMap[photo.id] || 0}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <p className="text-xs text-slate-600 mt-2">
                        {progressMap[photo.id] || 0}% complete
                      </p>
                    </div>
                  ) : hasPhoto ? (
                    <div className="relative group aspect-square">
                      <img
                        src={uploadedPhoto.url}
                        alt={photo.label}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removePhoto(uploadedPhoto.id);
                          }}
                          className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-sm"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <div className="flex items-center space-x-2 text-white">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-sm font-medium">{photo.label}</span>
                        </div>
                        <p className="text-xs text-slate-200">{photo.description}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-square flex flex-col items-center justify-center p-5 text-center group">
                      <div className="text-4xl mb-3 text-slate-400 group-hover:text-[#f6851f] transition-colors">
                        {photo.icon}
                      </div>
                      <p className="text-sm font-semibold text-slate-800 mb-2">{photo.label}</p>
                      <p className="text-xs text-slate-500 mb-4">{photo.description}</p>
                      <div className='border-2 border-slate-300 p-2 rounded-md'>
                        <button
                          onClick={() => {
                            document.getElementById(`photo-upload-${photo.id}`).click();
                          }}
                          className="cursor-pointer w-full inline-flex items-center justify-center h-8 px-3 rounded-md text-black border-slate-200 border-2 text-sm font-medium transition-colors duration-200 "
                        >
                          Upload
                        </button>
                        <p className='text-xs mt-4 text-slate-500'>{photo.tip}</p>
                      </div>
                    </div>
                  )}
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
        </motion.div>

        {/* Accident Photos Section */}
        {hasAccident && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-slate-800 font-sans">Accident Photos</h2>
              <motion.button
                onClick={addAccidentPhotoCard}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-[#f6851f] to-[#e63946] px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="text-lg ">+</span> Add Accident Photo
              </motion.button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {accidentPhotos.map((photo, index) => {
                const uploadedPhoto = accidentPhotos.find((p) => p.id === photo.id && p.file);
                const hasPhoto = !!uploadedPhoto;
                const isUploadingThisPhoto = !!uploadingMap[photo.id];

                return (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className={`relative rounded-2xl overflow-hidden shadow-md backdrop-blur-sm bg-white/80 transition-all duration-300 cursor-pointer ${
                      photo.required
                        ? hasPhoto
                          ? 'border-2 border-green-300/50 bg-green-50/50'
                          : 'border-2 border-[#f6851f]/30'
                        : hasPhoto
                        ? 'border-2 border-green-300/50 bg-green-50/50'
                        : 'border-2 border-slate-200/50 hover:border-[#f6851f]/50 hover:bg-orange-50/30'
                    } hover:shadow-lg`}
                    onClick={() => {
                      if (!hasPhoto && !uploadingMap[photo.id]) {
                        document.getElementById(`photo-upload-${photo.id}`).click();
                      }
                    }}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, photo.id)}
                  >
                    {isUploadingThisPhoto ? (
                      <div className="aspect-square flex flex-col items-center justify-center p-5 text-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-10 h-10 border-4 border-[#f6851f] border-t-transparent rounded-full mb-4"
                        />
                        <p className="text-sm font-medium text-slate-800">Uploading...</p>
                        <div className="w-full bg-slate-200/50 rounded-full h-2 mt-3">
                          <motion.div
                            className="bg-[#f6851f] h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressMap[photo.id] || 0}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <p className="text-xs text-slate-600 mt-2">
                          {progressMap[photo.id] || 0}% complete
                        </p>
                      </div>
                    ) : hasPhoto ? (
                      <div className="relative group aspect-square">
                        <img
                          src={uploadedPhoto.url}
                          alt={photo.label}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removePhoto(uploadedPhoto.id, true);
                            }}
                            className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-sm"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <div className="flex items-center space-x-2 text-white">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-sm font-medium">{photo.label}</span>
                          </div>
                          <p className="text-xs text-slate-200">{photo.description}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-square flex flex-col items-center justify-center p-5 text-center group">
                        <div className="text-4xl mb-3 text-slate-400 group-hover:text-[#f6851f] transition-colors">
                          {photo.icon}
                        </div>
                        <p className="text-sm font-semibold text-slate-800 mb-2">{photo.label}</p>
                        <p className="text-xs text-slate-500 mb-3">{photo.description}</p>
                        <div className="w-9 h-9 rounded-full border-2 border-dashed border-slate-300 group-hover:border-[#f6851f] group-hover:bg-orange-50/20 flex items-center justify-center transition-all">
                          <span className="text-slate-400 group-hover:text-[#f6851f] text-xl">+</span>
                        </div>
                      </div>
                    )}
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
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mt-10 pt-6 border-t border-slate-200/50"
        >
          <motion.button
            onClick={onPrev}
            className="cursor-pointer inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200/50 bg-white/90 px-6 text-sm font-semibold text-slate-800 shadow-md backdrop-blur-md transition-all hover:bg-slate-50/80 hover:shadow-lg"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </motion.button>
          <motion.button
            onClick={() => {
              onChange({ photos: [...photos, ...accidentPhotos.filter(p => p.file)] });
              onNext();
            }}
            disabled={!isComplete}
            className={`cursor-pointer inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f6851f] to-[#e63946] px-8 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition-all ${
              !isComplete ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            whileHover={isComplete ? { scale: 1.03 } : {}}
            whileTap={isComplete ? { scale: 0.97 } : {}}
          >
            Continue
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}