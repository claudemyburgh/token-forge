'use client';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ImageIcon, XCircleIcon } from 'lucide-react';
import { useState } from 'react';
import Dropzone from 'react-dropzone';

const ImagePreview = ({
    url,
    onRemove,
}: {
    url: string;
    onRemove: () => void;
}) => (
    <div className="relative aspect-square">
        <button
            className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2"
            onClick={onRemove}
        >
            <XCircleIcon className="h-5 w-5 fill-primary text-primary-foreground" />
        </button>
        <img
            src={url}
            height={500}
            width={500}
            alt="avatar"
            className="h-full w-full rounded-md border border-border object-cover"
        />
    </div>
);

export default function AvatarUpload() {
    const [profilePicture, setProfilePicture] = useState<string | null>(null);

    return (
        <div className="w-full max-w-40">
            <Label htmlFor="profile">Profile Picture</Label>
            <div className="mt-1 w-full">
                {profilePicture ? (
                    <ImagePreview
                        url={profilePicture}
                        onRemove={() => setProfilePicture(null)}
                    />
                ) : (
                    <Dropzone
                        onDrop={(acceptedFiles) => {
                            const file = acceptedFiles[0];
                            if (file) {
                                const imageUrl = URL.createObjectURL(file);
                                setProfilePicture(imageUrl);
                            }
                        }}
                        accept={{
                            'image/png': ['.png', '.jpg', '.jpeg', '.webp'],
                        }}
                        maxFiles={1}
                    >
                        {({
                            getRootProps,
                            getInputProps,
                            isDragActive,
                            isDragAccept,
                            isDragReject,
                        }) => (
                            <div
                                {...getRootProps()}
                                className={cn(
                                    'flex aspect-square items-center justify-center rounded-md border border-dashed focus:border-primary focus:outline-hidden',
                                    {
                                        'border-primary bg-secondary':
                                            isDragActive && isDragAccept,
                                        'border-destructive bg-destructive/20':
                                            isDragActive && isDragReject,
                                    },
                                )}
                            >
                                <input {...getInputProps()} id="profile" />
                                <ImageIcon
                                    className="h-16 w-16"
                                    strokeWidth={1.25}
                                />
                            </div>
                        )}
                    </Dropzone>
                )}
            </div>
        </div>
    );
}
