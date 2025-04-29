import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Settings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/api/settings');
      const settingsMap = response.data.data.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {});
      setSettings(settingsMap);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch settings');
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Update each setting
      const updatePromises = Object.entries(settings).map(([key, value]) =>
        axios.put(`/api/settings/${key}`, { value })
      );

      await Promise.all(updatePromises);
      setSuccess('Settings updated successfully');
    } catch (err) {
      setError('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
    }
  };

  const handleLogoUpload = async () => {
    if (!logoFile) return;

    const formData = new FormData();
    formData.append('logo', logoFile);

    try {
      const response = await axios.post('/api/settings/logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSettings(prev => ({
        ...prev,
        site_logo: response.data.data.logo_url,
      }));
      setSuccess('Logo uploaded successfully');
      setLogoFile(null);
    } catch (err) {
      setError('Failed to upload logo');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Website Settings</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Logo</h2>
          {settings.site_logo && (
            <div className="mb-4">
              <img
                src={settings.site_logo}
                alt="Site Logo"
                className="h-20 object-contain"
              />
            </div>
          )}
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            <button
              type="button"
              onClick={handleLogoUpload}
              disabled={!logoFile}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Upload Logo
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Site Name
          </label>
          <input
            type="text"
            value={settings.site_name || ''}
            onChange={(e) => handleChange('site_name', e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Site Description
          </label>
          <textarea
            value={settings.site_description || ''}
            onChange={(e) => handleChange('site_description', e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="3"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Contact Email
          </label>
          <input
            type="email"
            value={settings.contact_email || ''}
            onChange={(e) => handleChange('contact_email', e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Contact Phone
          </label>
          <input
            type="tel"
            value={settings.contact_phone || ''}
            onChange={(e) => handleChange('contact_phone', e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings; 