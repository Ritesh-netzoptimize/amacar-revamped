import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Camera, Save, Edit3, Check, X } from 'lucide-react';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, San Francisco, CA 94102',
    bio: 'Car enthusiast and frequent seller on Amacar platform.',
    joinDate: '2024-01-01',
    totalAuctions: 12,
    totalEarnings: 45600,
    rating: 4.9,
  });

  const [editData, setEditData] = useState({ ...profile });

  const handleEdit = () => {
    setEditData({ ...profile });
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile({ ...editData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ ...profile });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="card p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-neutral-800">Profile Settings</h1>
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancel}
                    className="btn-ghost flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSave}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </div>

            {/* Profile Picture */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-primary-600" />
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-neutral-800">
                  {isEditing ? (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={editData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="input-field w-32"
                      />
                      <input
                        type="text"
                        value={editData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="input-field w-32"
                      />
                    </div>
                  ) : (
                    `${profile.firstName} ${profile.lastName}`
                  )}
                </h2>
                <p className="text-neutral-600">Member since {profile.joinDate}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-neutral-600">Rating:</span>
                    <span className="font-semibold text-warning">{profile.rating}/5</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-neutral-600">Auctions:</span>
                    <span className="font-semibold text-primary-600">{profile.totalAuctions}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Profile Information */}
          <motion.div variants={itemVariants} className="card p-8 mb-8">
            <h3 className="text-xl font-bold text-neutral-800 mb-6">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Email Address
                </label>
                {isEditing ? (
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="input-field pl-10"
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-neutral-600">
                    <Mail className="w-5 h-5" />
                    <span>{profile.email}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="input-field pl-10"
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-neutral-600">
                    <Phone className="w-5 h-5" />
                    <span>{profile.phone}</span>
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Address
                </label>
                {isEditing ? (
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      type="text"
                      value={editData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="input-field pl-10"
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-neutral-600">
                    <MapPin className="w-5 h-5" />
                    <span>{profile.address}</span>
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    value={editData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="input-field h-24 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-neutral-600">{profile.bio}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Statistics */}
          <motion.div variants={itemVariants} className="card p-8 mb-8">
            <h3 className="text-xl font-bold text-neutral-800 mb-6">Your Statistics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-primary-50 rounded-xl">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {profile.totalAuctions}
                </div>
                <div className="text-sm text-neutral-600">Total Auctions</div>
              </div>
              
              <div className="text-center p-6 bg-success/10 rounded-xl">
                <div className="text-3xl font-bold text-success mb-2">
                  ${profile.totalEarnings.toLocaleString()}
                </div>
                <div className="text-sm text-neutral-600">Total Earnings</div>
              </div>
              
              <div className="text-center p-6 bg-warning/10 rounded-xl">
                <div className="text-3xl font-bold text-warning mb-2">
                  {profile.rating}
                </div>
                <div className="text-sm text-neutral-600">Average Rating</div>
              </div>
            </div>
          </motion.div>

          {/* Account Settings */}
          <motion.div variants={itemVariants} className="card p-8">
            <h3 className="text-xl font-bold text-neutral-800 mb-6">Account Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-4 border-b border-neutral-200">
                <div>
                  <h4 className="font-semibold text-neutral-800">Email Notifications</h4>
                  <p className="text-sm text-neutral-600">Receive updates about your auctions and offers</p>
                </div>
                <button className="w-12 h-6 bg-primary-500 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between py-4 border-b border-neutral-200">
                <div>
                  <h4 className="font-semibold text-neutral-800">SMS Notifications</h4>
                  <p className="text-sm text-neutral-600">Get text alerts for important updates</p>
                </div>
                <button className="w-12 h-6 bg-neutral-300 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between py-4">
                <div>
                  <h4 className="font-semibold text-neutral-800">Two-Factor Authentication</h4>
                  <p className="text-sm text-neutral-600">Add an extra layer of security to your account</p>
                </div>
                <button className="btn-secondary">
                  Enable
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
