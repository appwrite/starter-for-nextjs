'use client';

import { useAuth } from './AuthProvider';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRef, useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { Camera, X } from 'lucide-react';

function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new window.Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', error => reject(error));
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
    });
}

export function UserProfile() {
    const { user, logout } = useAuth();
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
    const [showCrop, setShowCrop] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const onCropComplete = useCallback((_: unknown, croppedAreaPixels: { x: number; y: number; width: number; height: number }) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setShowCrop(true);
    };

    const getCroppedImg = async (imageSrc: string, crop: { x: number; y: number; width: number; height: number }) => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('No 2d context');
        canvas.width = crop.width;
        canvas.height = crop.height;
        ctx.drawImage(
            image,
            crop.x,
            crop.y,
            crop.width,
            crop.height,
            0,
            0,
            crop.width,
            crop.height
        );
        return new Promise<Blob>((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (blob) resolve(blob);
                else reject(new Error('Canvas is empty'));
            }, 'image/jpeg');
        });
    };

    const handleCropSave = async () => {
        if (!previewUrl || !croppedAreaPixels) return;
        setUploading(true);
        setError(null);
        try {
            const croppedBlob = await getCroppedImg(previewUrl, croppedAreaPixels);
            const formData = new FormData();
            formData.append('profilePic', new File([croppedBlob], selectedFile?.name || 'profile.jpg', { type: 'image/jpeg' }));
            const res = await fetch('/api/user', {
                method: 'POST',
                body: formData,
            });
            let data = null;
            try {
                data = await res.json();
            } catch {
                setError('Upload failed: Invalid server response.');
                setUploading(false);
                return;
            }
            if (data && data.success) {
                window.location.reload();
                return;
            } else {
                setError(data?.error || 'Upload failed.');
            }
        } catch (err) {
            setError((err as Error).message || 'Upload failed.');
        }
        setUploading(false);
        setShowCrop(false);
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    if (!user) return null;

    return (
        <div className="w-full max-w-4xl mx-auto shadow-2xl rounded-2xl bg-white overflow-hidden">
            {/* Dark top bar */}
            <div className="h-4 bg-[#001a33] rounded-t-2xl"></div>
            
            {/* Profile Header with gradient */}
            <div className="relative bg-gradient-to-br from-[#002248] via-[#003366] to-[#004488] text-white">
                <div className="flex flex-col items-center justify-center px-8 py-12">
                    <div className="relative group">
                        <Avatar className="w-32 h-32 mb-6 ring-4 ring-white/20 shadow-xl transition-all duration-300 group-hover:ring-white/40">
                            <AvatarImage 
                                src={user ? `/api/user/profile-pic/${user.upi}?v=${Date.now()}` : undefined} 
                                alt={user?.given_name} 
                                className="object-cover"
                            />
                            <AvatarFallback className="text-4xl bg-white/10 text-white">
                                {user?.given_name?.[0] ?? '?'}
                            </AvatarFallback>
                        </Avatar>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-6 right-0 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-300 hover:scale-110"
                            disabled={uploading}
                        >
                            <Camera className="w-5 h-5 text-white" />
                        </button>
                    </div>
                    <h1 
                        className="text-4xl font-bold mb-2 text-center" 
                        style={{ fontFamily: 'Literata, serif' }}
                    >
                        {user.full_name}
                    </h1>
                    <p className="text-xl text-white/80 mb-6 text-center">{user.email}</p>
                    <Button 
                        onClick={logout} 
                        variant="secondary"
                        size="lg" 
                        className="bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/40 transition-all duration-300"
                    >
                        Logout
                    </Button>
                </div>
            </div>

            {/* Profile Info Sections */}
            <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-2 h-2 bg-[#002248] rounded-full"></div>
                                Basic Information
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                    <p className="text-base text-gray-900">{user.department}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">UPI</label>
                                    <p className="text-base text-gray-900 font-mono">{user.upi}</p>
                                </div>
                                {user.student_id && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                                        <p className="text-base text-gray-900 font-mono">{user.student_id}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-2 h-2 bg-[#002248] rounded-full"></div>
                                Role & Status
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Role</label>
                                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                                        user.role === 'STUDENT' ? 'bg-blue-100 text-blue-800' :
                                        user.role === 'MENTOR' ? 'bg-green-100 text-green-800' :
                                        user.role === 'SENIOR_MENTOR' ? 'bg-yellow-100 text-yellow-800' :
                                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                                        user.role === 'SUPERADMIN' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {user.role.replace('_', ' ')}
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Types</label>
                                    <div className="flex flex-wrap gap-2">
                                        {user.is_student && (
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Student</span>
                                        )}
                                        {user.role === 'MENTOR' && (
                                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Mentor</span>
                                        )}
                                        {user.role === 'SENIOR_MENTOR' && (
                                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Senior Mentor</span>
                                        )}
                                        {user.role === 'ADMIN' && (
                                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Admin</span>
                                        )}
                                        {user.role === 'SUPERADMIN' && (
                                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Superadmin</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-2 h-2 bg-[#002248] rounded-full"></div>
                                Permissions
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {user.permissions && user.permissions.length > 0 ? (
                                    user.permissions.map(permission => (
                                        <span
                                            key={permission}
                                            className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full font-medium"
                                        >
                                            {permission.replace('_', ' ')}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-sm text-gray-500 italic">No permissions assigned</span>
                                )}
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-2 h-2 bg-[#002248] rounded-full"></div>
                                Profile Settings
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                        />
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={uploading}
                                            className="flex items-center gap-2"
                                        >
                                            <Camera className="w-4 h-4" />
                                            {uploading ? 'Uploading...' : 'Change Picture'}
                                        </Button>
                                    </div>
                                    {error && (
                                        <p className="text-sm text-red-600 mt-2 bg-red-50 p-2 rounded border border-red-200">
                                            {error}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Improved Crop Modal */}
            {showCrop && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">Crop Profile Picture</h3>
                            <button
                                onClick={() => setShowCrop(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        
                        <div className="w-full h-80 relative bg-gray-100 rounded-lg mb-4 overflow-hidden">
                            {previewUrl && (
                                <Cropper
                                    image={previewUrl}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={onCropComplete}
                                    cropShape="round"
                                    showGrid={false}
                                />
                            )}
                        </div>
                        
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Zoom</label>
                            <input
                                type="range"
                                min={1}
                                max={3}
                                step={0.01}
                                value={zoom}
                                onChange={e => setZoom(Number(e.target.value))}
                                className="w-full accent-[#002248]"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>1x</span>
                                <span>3x</span>
                            </div>
                        </div>
                        
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[#002248] bg-gray-50">
                                {previewUrl && croppedAreaPixels && (
                                    <CroppedPreview image={previewUrl} crop={croppedAreaPixels} />
                                )}
                            </div>
                        </div>
                        
                        <div className="flex gap-3">
                            <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => setShowCrop(false)}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button 
                                size="sm" 
                                onClick={handleCropSave} 
                                disabled={uploading}
                                className="flex-1 bg-[#002248] hover:bg-[#003366]"
                            >
                                {uploading ? 'Saving...' : 'Save Picture'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function CroppedPreview({ image, crop }: { image: string; crop: { x: number; y: number; width: number; height: number } }) {
    const [preview, setPreview] = useState<string | null>(null);
    
    useEffect(() => {
        async function generatePreview() {
            try {
                const img = await createImage(image);
                const canvas = document.createElement('canvas');
                canvas.width = crop.width;
                canvas.height = crop.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;
                ctx.drawImage(
                    img,
                    crop.x,
                    crop.y,
                    crop.width,
                    crop.height,
                    0,
                    0,
                    crop.width,
                    crop.height
                );
                setPreview(canvas.toDataURL('image/webp'));
            } catch (error) {
                console.error('Error generating preview:', error);
            }
        }
        generatePreview();
    }, [image, crop]);
    
    if (!preview) return <div className="w-full h-full bg-gray-200 animate-pulse rounded-full" />;
    return <img src={preview} alt="Preview" className="object-cover w-full h-full" />;
}